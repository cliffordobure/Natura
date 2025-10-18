const Attendance = require('../models/Attendance');
const Invoice = require('../models/Invoice');
const Child = require('../models/Child');
const Classroom = require('../models/Classroom');
const Activity = require('../models/Activity');
const asyncHandler = require('../utils/asyncHandler');
const { ATTENDANCE_STATUS, INVOICE_STATUS } = require('../config/constants');

// @desc    Get attendance report
// @route   GET /api/v1/reports/attendance
// @access  Private (Teachers and above)
const getAttendanceReport = asyncHandler(async (req, res) => {
  const { schoolId, startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error('Start date and end date are required');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Build filter
  const filter = {
    date: { $gte: start, $lte: end },
  };

  // Get total children count
  const childFilter = schoolId ? { schoolId } : {};
  const totalChildren = await Child.countDocuments(childFilter);

  // Get attendance records
  const attendanceRecords = await Attendance.find(filter);

  // Calculate daily stats
  const dailyStats = {};
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  for (let i = 0; i < daysDiff; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    dailyStats[dateStr] = {
      date: dateStr,
      present: 0,
      absent: 0,
      attendanceRate: 0,
    };
  }

  // Process attendance records
  let totalAbsences = 0;
  attendanceRecords.forEach((record) => {
    const dateStr = record.date.toISOString().split('T')[0];
    if (dailyStats[dateStr]) {
      if (record.status === ATTENDANCE_STATUS.CHECKED_IN || record.status === ATTENDANCE_STATUS.CHECKED_OUT) {
        dailyStats[dateStr].present++;
      } else if (record.status === ATTENDANCE_STATUS.ABSENT) {
        dailyStats[dateStr].absent++;
        totalAbsences++;
      }
    }
  });

  // Calculate attendance rates
  const daily = Object.values(dailyStats).map((day) => {
    const total = day.present + day.absent;
    day.attendanceRate = total > 0 ? (day.present / total) * 100 : 0;
    return day;
  });

  // Calculate average attendance rate
  const totalPresent = daily.reduce((sum, day) => sum + day.present, 0);
  const totalRecords = daily.reduce((sum, day) => sum + day.present + day.absent, 0);
  const averageAttendanceRate = totalRecords > 0 ? (totalPresent / totalRecords) * 100 : 0;

  res.status(200).json({
    summary: {
      totalChildren,
      averageAttendanceRate: parseFloat(averageAttendanceRate.toFixed(2)),
      totalAbsences,
    },
    daily,
  });
});

// @desc    Get financial report
// @route   GET /api/v1/reports/financial
// @access  Private (Admin and above)
const getFinancialReport = asyncHandler(async (req, res) => {
  const { schoolId, year, month } = req.query;

  if (!year) {
    res.status(400);
    throw new Error('Year is required');
  }

  // Build filter
  const filter = {};
  if (schoolId) filter.schoolId = schoolId;

  // Date range filter
  const startDate = new Date(year, month ? month - 1 : 0, 1);
  const endDate = month
    ? new Date(year, month, 0, 23, 59, 59)
    : new Date(year, 11, 31, 23, 59, 59);

  filter.invoiceDate = { $gte: startDate, $lte: endDate };

  // Get all invoices in the period
  const invoices = await Invoice.find(filter);

  // Calculate totals
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalPending = invoices
    .filter((inv) => inv.status === INVOICE_STATUS.PENDING)
    .reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0);
  const totalOverdue = invoices
    .filter((inv) => inv.status === INVOICE_STATUS.OVERDUE)
    .reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0);

  // Calculate breakdown by category
  const breakdown = {};
  invoices.forEach((invoice) => {
    invoice.items.forEach((item) => {
      if (!breakdown[item.description]) {
        breakdown[item.description] = 0;
      }
      breakdown[item.description] += item.total;
    });
  });

  const breakdownArray = Object.keys(breakdown).map((category) => ({
    category,
    amount: breakdown[category],
  }));

  res.status(200).json({
    summary: {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalPaid: parseFloat(totalPaid.toFixed(2)),
      totalPending: parseFloat(totalPending.toFixed(2)),
      totalOverdue: parseFloat(totalOverdue.toFixed(2)),
    },
    breakdown: breakdownArray,
  });
});

// @desc    Get enrollment report
// @route   GET /api/v1/reports/enrollment
// @access  Private (Admin and above)
const getEnrollmentReport = asyncHandler(async (req, res) => {
  const { schoolId } = req.query;

  // Build filter
  const filter = { isActive: true };
  if (schoolId) filter.schoolId = schoolId;

  // Get total children
  const totalChildren = await Child.countDocuments(filter);

  // Get classrooms
  const classroomFilter = schoolId ? { schoolId, isActive: true } : { isActive: true };
  const classrooms = await Classroom.find(classroomFilter);

  // Calculate total capacity
  const totalCapacity = classrooms.reduce((sum, room) => sum + room.capacity, 0);

  // Get by classroom
  const byClassroom = await Promise.all(
    classrooms.map(async (classroom) => {
      const enrolled = await Child.countDocuments({
        classroomId: classroom._id,
        isActive: true,
      });
      return {
        classroomId: classroom._id,
        classroomName: classroom.name,
        enrolled,
        capacity: classroom.capacity,
        occupancyRate: parseFloat(((enrolled / classroom.capacity) * 100).toFixed(1)),
      };
    })
  );

  // Get by age group
  const ageGroups = {};
  for (const classroom of classrooms) {
    const count = await Child.countDocuments({
      classroomId: classroom._id,
      isActive: true,
    });
    if (!ageGroups[classroom.ageGroup]) {
      ageGroups[classroom.ageGroup] = 0;
    }
    ageGroups[classroom.ageGroup] += count;
  }

  const byAgeGroup = Object.keys(ageGroups).map((ageGroup) => ({
    ageGroup,
    count: ageGroups[ageGroup],
  }));

  res.status(200).json({
    summary: {
      totalChildren,
      totalCapacity,
      occupancyRate: parseFloat(((totalChildren / totalCapacity) * 100).toFixed(1)),
    },
    byClassroom,
    byAgeGroup,
  });
});

// @desc    Get activity summary report
// @route   GET /api/v1/reports/activities
// @access  Private
const getActivitySummaryReport = asyncHandler(async (req, res) => {
  const { childId, startDate, endDate } = req.query;

  if (!childId || !startDate || !endDate) {
    res.status(400);
    throw new Error('Child ID, start date, and end date are required');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get activities
  const activities = await Activity.find({
    childId,
    timestamp: { $gte: start, $lte: end },
  });

  // Calculate summary
  const summary = {
    totalActivities: activities.length,
    meals: activities.filter((a) => a.type === 'meal').length,
    naps: activities.filter((a) => a.type === 'nap').length,
    bathroom: activities.filter((a) => a.type === 'bathroom').length,
    photos: activities.filter((a) => a.type === 'photo').length,
  };

  // Calculate days
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // Calculate averages
  const napActivities = activities.filter((a) => a.type === 'nap' && a.metadata?.duration);
  const totalNapDuration = napActivities.reduce((sum, a) => sum + (a.metadata.duration || 0), 0);

  const averages = {
    mealsPerDay: parseFloat((summary.meals / days).toFixed(2)),
    napsPerDay: parseFloat((summary.naps / days).toFixed(2)),
    napDurationMinutes: napActivities.length > 0 ? Math.round(totalNapDuration / napActivities.length) : 0,
  };

  res.status(200).json({
    summary,
    averages,
  });
});

module.exports = {
  getAttendanceReport,
  getFinancialReport,
  getEnrollmentReport,
  getActivitySummaryReport,
};

