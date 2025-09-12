# Course Enrollment Workflow

## Overview

The enrollment workflow has been fixed to ensure **payment is required before enrollment success** for paid courses. Free courses can be enrolled in directly.

## Current Implementation

### 1. **Free Courses (price = 0)**
- ✅ Direct enrollment without payment
- User clicks "Enroll for Free"
- Calls `api.enroll(token, courseId)` directly
- User gains immediate access

### 2. **Paid Courses (price > 0)**
- ✅ **Payment required before enrollment**
- User clicks "Purchase for $X" button
- Opens Lemon Squeezy payment modal
- **Only after successful payment** → enrollment is triggered
- User gains access only after payment confirmation

## Components

### PaymentModal Integration
```tsx
// For paid courses only
<PaymentModal
  type="course"
  courseData={{
    id: courseId,
    title: course.title,
    price: course.price,
    currency: course.currency || 'USD',
  }}
  onSuccess={handlePaymentSuccess} // Enrolls user after payment
  onCancel={() => console.log('Payment cancelled')}
>
  <Button>Purchase for ${price}</Button>
</PaymentModal>
```

### Enrollment Flow
```tsx
// FREE COURSES ONLY - blocks paid courses
const enrollFree = async () => {
  if (!token) return alert('Please login first')
  if (course?.price && course.price > 0) {
    alert('This is a paid course. Please use the payment option.')
    return // 🛑 BLOCKS PAID COURSE ENROLLMENT
  }
  
  await api.enroll(token, courseId)
  // Success - user enrolled
}

// PAID COURSES - called ONLY after payment success
const handlePaymentSuccess = async () => {
  // Payment completed → now enroll
  await api.enroll(token, courseId)  
  // User enrolled after payment
}
```

## Security Features

1. **Frontend Validation**: Paid courses cannot bypass payment
2. **Backend Validation**: Should verify payment before enrollment
3. **Token-based**: Requires authentication for enrollment
4. **Payment Verification**: Uses Lemon Squeezy secure checkout

## Backend Requirements

The backend should implement these checks:

### Enrollment API (`POST /api/v1/courses/{id}/enroll`)
```go
func (h *Handler) EnrollCourse(c *gin.Context) {
    courseID := c.Param("id")
    userID := c.GetString("user_id")
    
    // Get course details
    course, err := h.courseService.GetCourse(courseID)
    if err != nil {
        c.JSON(404, gin.H{"error": "Course not found"})
        return
    }
    
    // 🔒 CRITICAL: Check if course is paid
    if course.Price > 0 {
        // Verify user has paid for this course
        hasPaid, err := h.paymentService.VerifyCoursePurchase(userID, courseID)
        if err != nil || !hasPaid {
            c.JSON(403, gin.H{"error": "Payment required for this course"})
            return
        }
    }
    
    // Enroll user (free course OR payment verified)
    err = h.enrollmentService.EnrollUser(userID, courseID)
    if err != nil {
        c.JSON(500, gin.H{"error": "Enrollment failed"})
        return
    }
    
    c.JSON(200, gin.H{"message": "Enrollment successful"})
}
```

### Payment Webhook Handler
```go
func (h *Handler) HandleLemonSqueezyWebhook(c *gin.Context) {
    // Verify webhook signature
    // Parse payment data
    
    if event.Type == "order_created" && event.Status == "paid" {
        userID := event.CustomData["user_id"]
        courseID := event.CustomData["course_id"]
        
        // Record successful payment
        err := h.paymentService.RecordPayment(userID, courseID, event.Amount)
        if err != nil {
            // Handle error
            return
        }
        
        // Auto-enroll user after payment
        err = h.enrollmentService.EnrollUser(userID, courseID)
        if err != nil {
            // Handle enrollment error after payment
            // This is critical - payment succeeded but enrollment failed
            h.logger.Error("Post-payment enrollment failed", err)
        }
    }
}
```

## Testing Scenarios

### ✅ Valid Flows
1. **Free Course**: Click "Enroll for Free" → Enrolled immediately
2. **Paid Course**: Click "Purchase" → Complete payment → Auto-enrolled
3. **Already Enrolled**: Shows "Enrolled" status

### 🛑 Blocked Flows  
1. **Paid Course Without Payment**: Cannot enroll directly
2. **Unauthenticated**: Must login first
3. **Invalid Payment**: Payment fails → No enrollment

## Frontend Files Modified

- `src/routes/courses.$courseId.tsx` - Main enrollment logic
- `src/components/course/EnrollmentButton.tsx` - Reusable enrollment component
- `src/components/payment/PaymentModal.tsx` - Payment processing

## Key Changes Made

1. ✅ **Separated free vs paid enrollment logic**
2. ✅ **Payment modal integration for paid courses**
3. ✅ **Blocks direct enrollment on paid courses**
4. ✅ **Handles post-payment enrollment**
5. ✅ **Proper error handling and user feedback**

The enrollment workflow now correctly requires payment before enrollment success for paid courses! 🎉