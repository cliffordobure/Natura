module.exports = {
  USER_ROLES: {
    PARENT: 'parent',
    TEACHER: 'teacher',
    ADMIN: 'admin',
    DIRECTOR: 'director',
  },

  ATTENDANCE_STATUS: {
    CHECKED_IN: 'checkedIn',
    CHECKED_OUT: 'checkedOut',
    ABSENT: 'absent',
    SCHEDULED: 'scheduled',
  },

  ACTIVITY_TYPES: {
    MEAL: 'meal',
    NAP: 'nap',
    BATHROOM: 'bathroom',
    LEARNING: 'learning',
    PLAY: 'play',
    OUTDOOR: 'outdoor',
    ART: 'art',
    MUSIC: 'music',
    MILESTONE: 'milestone',
    INCIDENT: 'incident',
    PHOTO: 'photo',
    VIDEO: 'video',
    NOTE: 'note',
  },

  GENDER: {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
  },

  INVOICE_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    OVERDUE: 'overdue',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
  },

  PAYMENT_METHODS: {
    CREDIT_CARD: 'creditCard',
    DEBIT_CARD: 'debitCard',
    BANK_TRANSFER: 'bankTransfer',
    CASH: 'cash',
    CHECK: 'check',
  },

  MESSAGE_TYPES: {
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
    DOCUMENT: 'document',
  },

  NOTIFICATION_TYPES: {
    CHECK_IN: 'checkIn',
    CHECK_OUT: 'checkOut',
    ACTIVITY: 'activity',
    MESSAGE: 'message',
    INCIDENT: 'incident',
    PAYMENT: 'payment',
    ANNOUNCEMENT: 'announcement',
    REMINDER: 'reminder',
  },

  EVENT_TYPES: {
    HOLIDAY: 'holiday',
    FIELD_TRIP: 'fieldTrip',
    PARENT_TEACHER_CONFERENCE: 'parentTeacherConference',
    SCHOOL_EVENT: 'schoolEvent',
    BIRTHDAY: 'birthday',
    CLASS_ACTIVITY: 'classActivity',
    REMINDER: 'reminder',
  },

  DEVELOPMENT_DOMAINS: {
    COGNITIVE: 'cognitive',
    PHYSICAL: 'physical',
    SOCIAL_EMOTIONAL: 'socialEmotional',
    LANGUAGE: 'language',
    CREATIVE: 'creative',
  },

  ASSESSMENT_LEVELS: {
    NOT_YET: 'notYet',
    EMERGING: 'emerging',
    PROFICIENT: 'proficient',
    ADVANCED: 'advanced',
  },

  AGE_GROUPS: [
    'Infants (0-12 months)',
    'Toddlers (1-2 years)',
    'Preschool (3-5 years)',
    'Kindergarten (5-6 years)',
  ],

  MEAL_TYPES: {
    BREAKFAST: 'breakfast',
    LUNCH: 'lunch',
    SNACK: 'snack',
    DINNER: 'dinner',
  },

  MEAL_AMOUNTS: {
    ALL: 'all',
    MOST: 'most',
    SOME: 'some',
    NONE: 'none',
  },

  BATHROOM_TYPES: {
    DIAPER: 'diaper',
    POTTY: 'potty',
    TOILET: 'toilet',
  },

  INCIDENT_SEVERITY: {
    MINOR: 'minor',
    MODERATE: 'moderate',
    SERIOUS: 'serious',
  },
};

