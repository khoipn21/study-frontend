#!/bin/bash

# Test script for authentication flow
echo "=== Testing Authentication Flow ==="

API_BASE="http://localhost:8080/api/v1"

echo "1. Testing instructor registration..."
INSTRUCTOR_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "test_instructor", "email": "test.instructor@example.com", "password": "password123", "role": "instructor"}')

echo "Registration Response: $INSTRUCTOR_RESPONSE"

# Extract token from JSON response (basic parsing)
INSTRUCTOR_TOKEN=$(echo "$INSTRUCTOR_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Instructor Token: $INSTRUCTOR_TOKEN"

echo ""
echo "2. Testing student registration..."
STUDENT_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "test_student", "email": "test.student@example.com", "password": "password123", "role": "student"}')

echo "Registration Response: $STUDENT_RESPONSE"

STUDENT_TOKEN=$(echo "$STUDENT_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Student Token: $STUDENT_TOKEN"

echo ""
echo "3. Testing instructor dashboard without auth (should work due to temp debug mode)..."
curl -s -X GET "$API_BASE/instructor/dashboard/overview" \
  -H "Content-Type: application/json" | head -c 100
echo "..."

echo ""
echo "4. Testing instructor dashboard WITH auth..."
curl -s -X GET "$API_BASE/instructor/dashboard/overview" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $INSTRUCTOR_TOKEN" | head -c 100
echo "..."

echo ""
echo "5. Testing student dashboard..."
STUDENT_ID=$(echo "$STUDENT_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "Student ID: $STUDENT_ID"

curl -s -X GET "$API_BASE/dashboard/user/$STUDENT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" | head -c 100
echo "..."

echo ""
echo "=== Authentication Flow Test Complete ==="