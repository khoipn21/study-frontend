/**
 * Vietnamese localization utilities and translations
 * Provides Vietnamese language support for the Study Platform
 */

export type SupportedLocale = 'vi-VN' | 'en-US'

/**
 * Vietnamese translations for common UI elements
 */
export const vietnameseTranslations = {
  // Common actions
  actions: {
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    edit: 'Chỉnh sửa',
    view: 'Xem',
    download: 'Tải xuống',
    upload: 'Tải lên',
    search: 'Tìm kiếm',
    filter: 'Lọc',
    sort: 'Sắp xếp',
    reset: 'Đặt lại',
    submit: 'Gửi',
    close: 'Đóng',
    back: 'Quay lại',
    next: 'Tiếp theo',
    previous: 'Trước',
    confirm: 'Xác nhận',
    continue: 'Tiếp tục',
    finish: 'Hoàn thành',
    retry: 'Thử lại',
  },

  // Navigation
  navigation: {
    home: 'Trang chủ',
    courses: 'Khóa học',
    dashboard: 'Bảng điều khiển',
    profile: 'Hồ sơ',
    settings: 'Cài đặt',
    help: 'Trợ giúp',
    about: 'Giới thiệu',
    contact: 'Liên hệ',
    login: 'Đăng nhập',
    logout: 'Đăng xuất',
    register: 'Đăng ký',
    myAccount: 'Tài khoản của tôi',
    myCourses: 'Khóa học của tôi',
    wishlist: 'Danh sách yêu thích',
    cart: 'Giỏ hàng',
    billing: 'Thanh toán',
  },

  // Course-related terms
  courses: {
    course: 'Khóa học',
    courses: 'Khóa học',
    freeCourse: 'Khóa học miễn phí',
    paidCourse: 'Khóa học trả phí',
    newCourse: 'Khóa học mới',
    popularCourse: 'Khóa học phổ biến',
    featuredCourse: 'Khóa học nổi bật',
    recommendedCourse: 'Khóa học đề xuất',

    // Course details
    instructor: 'Giảng viên',
    duration: 'Thời lượng',
    level: 'Cấp độ',
    category: 'Danh mục',
    language: 'Ngôn ngữ',
    subtitles: 'Phụ đề',
    rating: 'Đánh giá',
    reviews: 'Nhận xét',
    students: 'Học viên',
    lectures: 'Bài giảng',
    assignments: 'Bài tập',
    quizzes: 'Bài kiểm tra',
    certificate: 'Chứng chỉ',

    // Course actions
    enroll: 'Đăng ký học',
    enrollNow: 'Đăng ký ngay',
    startLearning: 'Bắt đầu học',
    continueLearning: 'Tiếp tục học',
    preview: 'Xem trước',
    addToWishlist: 'Thêm vào yêu thích',
    removeFromWishlist: 'Bỏ khỏi yêu thích',
    share: 'Chia sẻ',

    // Course levels
    beginner: 'Cơ bản',
    intermediate: 'Trung cấp',
    advanced: 'Nâng cao',
    expert: 'Chuyên gia',
    allLevels: 'Tất cả cấp độ',

    // Course status
    published: 'Đã xuất bản',
    draft: 'Bản nháp',
    archived: 'Đã lưu trữ',
    comingSoon: 'Sắp ra mắt',

    // Course categories
    programming: 'Lập trình',
    business: 'Kinh doanh',
    design: 'Thiết kế',
    marketing: 'Marketing',
    photography: 'Nhiếp ảnh',
    music: 'Âm nhạc',
    health: 'Sức khỏe',
    fitness: 'Thể dục',
    lifestyle: 'Lối sống',
    personalDevelopment: 'Phát triển bản thân',
    academic: 'Học thuật',
    testPrep: 'Luyện thi',
    languageLearning: 'Học ngôn ngữ',
  },

  // Learning interface
  learning: {
    progress: 'Tiến độ',
    completed: 'Đã hoàn thành',
    inProgress: 'Đang học',
    notStarted: 'Chưa bắt đầu',
    watchTime: 'Thời gian xem',
    totalTime: 'Tổng thời gian',
    currentLesson: 'Bài học hiện tại',
    nextLesson: 'Bài học tiếp theo',
    previousLesson: 'Bài học trước',
    lessonCompleted: 'Bài học đã hoàn thành',
    courseCompleted: 'Khóa học đã hoàn thành',

    // Video player
    play: 'Phát',
    pause: 'Tạm dừng',
    volume: 'Âm lượng',
    fullscreen: 'Toàn màn hình',
    speed: 'Tốc độ',
    quality: 'Chất lượng',
    captions: 'Phụ đề',

    // Notes and bookmarks
    notes: 'Ghi chú',
    bookmarks: 'Dấu trang',
    addNote: 'Thêm ghi chú',
    addBookmark: 'Thêm dấu trang',
    saveNote: 'Lưu ghi chú',
    deleteNote: 'Xóa ghi chú',

    // Quiz and assignments
    quiz: 'Bài kiểm tra',
    assignment: 'Bài tập',
    submitAnswer: 'Gửi đáp án',
    correctAnswer: 'Đáp án đúng',
    incorrectAnswer: 'Đáp án sai',
    score: 'Điểm số',
    passingScore: 'Điểm qua môn',
    retakeQuiz: 'Làm lại bài kiểm tra',
  },

  // Payment and pricing
  payment: {
    price: 'Giá',
    originalPrice: 'Giá gốc',
    salePrice: 'Giá khuyến mãi',
    discount: 'Giảm giá',
    free: 'Miễn phí',
    vndCurrency: 'VND',

    // Payment actions
    buyNow: 'Mua ngay',
    addToCart: 'Thêm vào giỏ',
    checkout: 'Thanh toán',
    payment: 'Thanh toán',
    paymentMethod: 'Phương thức thanh toán',
    paymentSuccess: 'Thanh toán thành công',
    paymentFailed: 'Thanh toán thất bại',

    // Payment terms
    oneTime: 'Một lần',
    monthly: 'Hàng tháng',
    yearly: 'Hàng năm',
    lifetime: 'Trọn đời',
    subscription: 'Đăng ký',

    // Payment methods
    creditCard: 'Thẻ tín dụng',
    debitCard: 'Thẻ ghi nợ',
    bankTransfer: 'Chuyển khoản ngân hàng',
    eWallet: 'Ví điện tử',
    momo: 'MoMo',
    zalopay: 'ZaloPay',
    vnpay: 'VNPay',
  },

  // User interface
  ui: {
    loading: 'Đang tải...',
    noData: 'Không có dữ liệu',
    error: 'Lỗi',
    success: 'Thành công',
    warning: 'Cảnh báo',
    info: 'Thông tin',

    // Forms
    required: 'Bắt buộc',
    optional: 'Tùy chọn',
    email: 'Email',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    name: 'Tên',
    firstName: 'Họ',
    lastName: 'Tên',
    phone: 'Số điện thoại',
    address: 'Địa chỉ',

    // Validation messages
    validation: {
      required: 'Trường này là bắt buộc',
      invalidEmail: 'Email không hợp lệ',
      passwordTooShort: 'Mật khẩu quá ngắn',
      passwordMismatch: 'Mật khẩu không khớp',
      invalidPhone: 'Số điện thoại không hợp lệ',
    },

    // Time formats
    time: {
      seconds: 'giây',
      minutes: 'phút',
      hours: 'giờ',
      days: 'ngày',
      weeks: 'tuần',
      months: 'tháng',
      years: 'năm',
      ago: 'trước',
      remaining: 'còn lại',
    },

    // Pagination
    pagination: {
      page: 'Trang',
      of: 'của',
      first: 'Đầu',
      last: 'Cuối',
      itemsPerPage: 'mục mỗi trang',
      showing: 'Hiển thị',
      to: 'đến',
      total: 'tổng',
    },
  },

  // Filters and search
  filters: {
    filter: 'Lọc',
    filters: 'Bộ lọc',
    clearFilters: 'Xóa bộ lọc',
    applyFilters: 'Áp dụng bộ lọc',
    noResultsFound: 'Không tìm thấy kết quả',
    searchResults: 'Kết quả tìm kiếm',
    searchPlaceholder: 'Tìm kiếm khóa học...',

    // Sort options
    sortBy: 'Sắp xếp theo',
    newest: 'Mới nhất',
    oldest: 'Cũ nhất',
    mostPopular: 'Phổ biến nhất',
    highestRated: 'Đánh giá cao nhất',
    lowestPrice: 'Giá thấp nhất',
    highestPrice: 'Giá cao nhất',
    alphabetical: 'Theo alphabet',

    // Filter categories
    allCategories: 'Tất cả danh mục',
    allLevels: 'Tất cả cấp độ',
    allPrices: 'Tất cả giá',
    allDurations: 'Tất cả thời lượng',
    allLanguages: 'Tất cả ngôn ngữ',

    // Duration filters
    under1Hour: 'Dưới 1 giờ',
    from1to3Hours: '1-3 giờ',
    from3to6Hours: '3-6 giờ',
    from6to12Hours: '6-12 giờ',
    above12Hours: 'Trên 12 giờ',
  },

  // Dashboard and profile
  dashboard: {
    dashboard: 'Bảng điều khiển',
    overview: 'Tổng quan',
    statistics: 'Thống kê',
    recentActivity: 'Hoạt động gần đây',
    achievements: 'Thành tích',
    certificates: 'Chứng chỉ',

    // Profile
    profile: 'Hồ sơ',
    editProfile: 'Chỉnh sửa hồ sơ',
    changePassword: 'Đổi mật khẩu',
    accountSettings: 'Cài đặt tài khoản',
    notifications: 'Thông báo',
    privacy: 'Quyền riêng tư',

    // Statistics
    totalCourses: 'Tổng số khóa học',
    completedCourses: 'Khóa học đã hoàn thành',
    inProgressCourses: 'Khóa học đang học',
    totalWatchTime: 'Tổng thời gian học',
    averageRating: 'Đánh giá trung bình',
    skillLevel: 'Cấp độ kỹ năng',
  },

  // Notifications and messages
  notifications: {
    notification: 'Thông báo',
    notifications: 'Thông báo',
    newNotification: 'Thông báo mới',
    markAsRead: 'Đánh dấu đã đọc',
    markAllAsRead: 'Đánh dấu tất cả đã đọc',
    noNotifications: 'Không có thông báo',

    // Notification types
    courseUpdate: 'Cập nhật khóa học',
    newMessage: 'Tin nhắn mới',
    paymentConfirmation: 'Xác nhận thanh toán',
    courseCompletion: 'Hoàn thành khóa học',
    newReview: 'Đánh giá mới',
    systemUpdate: 'Cập nhật hệ thống',
  },

  // Error messages
  errors: {
    networkError: 'Lỗi kết nối mạng',
    serverError: 'Lỗi máy chủ',
    notFound: 'Không tìm thấy',
    unauthorized: 'Không có quyền truy cập',
    forbidden: 'Bị cấm truy cập',
    validationError: 'Lỗi xác thực',
    paymentError: 'Lỗi thanh toán',
    uploadError: 'Lỗi tải lên',
    genericError: 'Đã xảy ra lỗi',
    tryAgain: 'Vui lòng thử lại',
    contactSupport: 'Liên hệ hỗ trợ',
  },

  // Success messages
  success: {
    saved: 'Đã lưu thành công',
    updated: 'Đã cập nhật thành công',
    deleted: 'Đã xóa thành công',
    enrolled: 'Đăng ký thành công',
    paymentComplete: 'Thanh toán thành công',
    profileUpdated: 'Hồ sơ đã được cập nhật',
    passwordChanged: 'Mật khẩu đã được thay đổi',
    emailSent: 'Email đã được gửi',
    reviewSubmitted: 'Đánh giá đã được gửi',
  },
} as const

/**
 * Vietnamese date and time formatting
 */
export function formatVietnameseDate(
  date: Date | string,
  format: 'short' | 'long' | 'relative' = 'short',
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (format === 'relative') {
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return 'Vừa xong'
    if (diffMinutes < 60) return `${diffMinutes} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`
    return `${Math.floor(diffDays / 365)} năm trước`
  }

  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
    ...(format === 'long' && { weekday: 'long' }),
  }).format(dateObj)
}

/**
 * Vietnamese time duration formatting
 */
export function formatVietnameseDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} phút`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} giờ`
  }

  return `${hours} giờ ${remainingMinutes} phút`
}

/**
 * Vietnamese number formatting with unit suffixes
 */
export function formatVietnameseCount(count: number, unit: string): string {
  if (count === 0) return `Không có ${unit}`
  if (count === 1) return `1 ${unit}`

  const formattedNumber = new Intl.NumberFormat('vi-VN').format(count)
  return `${formattedNumber} ${unit}`
}

/**
 * Get localized text
 */
export function getTranslation(
  key: string,
  locale: SupportedLocale = 'vi-VN',
): string {
  if (locale === 'en-US') {
    // Return original English text for English locale
    return key
  }

  // Navigate through the translation object using dot notation
  const keys = key.split('.')
  let value: any = vietnameseTranslations

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, any>)[k]
    } else {
      return key // Return original key if translation not found
    }
  }

  return typeof value === 'string' ? value : key
}

/**
 * Translation hook for use in React components
 */
export function useTranslation(locale: SupportedLocale = 'vi-VN') {
  return {
    t: (key: string) => getTranslation(key, locale),
    locale,
    translations: vietnameseTranslations,
  }
}

/**
 * Common Vietnamese phrases for course marketplace
 */
export const vietnamesePhases = {
  welcomeMessage:
    'Chào mừng bạn đến với nền tảng học trực tuyến hàng đầu Việt Nam',
  featuredCoursesTitle: 'Khóa học nổi bật',
  newCoursesTitle: 'Khóa học mới',
  popularCoursesTitle: 'Khóa học phổ biến',
  freeCoursesTitle: 'Khóa học miễn phí',
  enrollmentSuccess: 'Chúc mừng! Bạn đã đăng ký thành công khóa học.',
  learningJourney: 'Bắt đầu hành trình học tập của bạn',
  expertInstructors: 'Học từ các chuyên gia hàng đầu',
  lifetimeAccess: 'Truy cập trọn đời',
  certificateOfCompletion: 'Nhận chứng chỉ hoàn thành',
  moneyBackGuarantee: 'Đảm bảo hoàn tiền 30 ngày',
  mobileAndDesktop: 'Học trên mọi thiết bị',
  supportCommunity: 'Cộng đồng hỗ trợ 24/7',
} as const

export default {
  vietnameseTranslations,
  formatVietnameseDate,
  formatVietnameseDuration,
  formatVietnameseCount,
  getTranslation,
  useTranslation,
  vietnamesePhases,
}
