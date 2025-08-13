#!/bin/bash

# Test script for TodoList API
# Make sure your NestJS application is running on http://localhost:3000

BASE_URL="http://localhost:3000"

echo "🧪 Testing TodoList API..."
echo "=========================="

# Test 1: Create a todo
echo -e "\n1️⃣  Creating a todo..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/todos" \
  -H "Content-Type: application/json" \
  -d '{"note": "Test todo item", "status": "pending"}')

echo "Response: $CREATE_RESPONSE"

# Extract the ID from the response (assuming it's the first todo created)
TODO_ID=$(echo $CREATE_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$TODO_ID" ]; then
  echo "❌ Failed to create todo or extract ID"
  exit 1
fi

echo "✅ Created todo with ID: $TODO_ID"

# Test 2: Get all todos
echo -e "\n2️⃣  Getting all todos..."
curl -s "$BASE_URL/todos" | jq '.' 2>/dev/null || echo "Response: $(curl -s "$BASE_URL/todos")"

# Test 3: Get specific todo
echo -e "\n3️⃣  Getting todo with ID: $TODO_ID..."
curl -s "$BASE_URL/todos/$TODO_ID" | jq '.' 2>/dev/null || echo "Response: $(curl -s "$BASE_URL/todos/$TODO_ID")"

# Test 4: Update todo
echo -e "\n4️⃣  Updating todo with ID: $TODO_ID..."
curl -s -X PATCH "$BASE_URL/todos/$TODO_ID" \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress", "note": "Updated test todo item"}' | jq '.' 2>/dev/null || echo "Response: $(curl -s -X PATCH "$BASE_URL/todos/$TODO_ID" -H "Content-Type: application/json" -d '{"status": "in_progress", "note": "Updated test todo item"}')"

# Test 5: Update order
echo -e "\n5️⃣  Updating order for todo with ID: $TODO_ID..."
curl -s -X PATCH "$BASE_URL/todos/$TODO_ID/order" \
  -H "Content-Type: application/json" \
  -d '{"order": 5}' | jq '.' 2>/dev/null || echo "Response: $(curl -s -X PATCH "$BASE_URL/todos/$TODO_ID/order" -H "Content-Type: application/json" -d '{"order": 5}')"

# Test 6: Get todos by status
echo -e "\n6️⃣  Getting todos with status 'in_progress'..."
curl -s "$BASE_URL/todos?status=in_progress" | jq '.' 2>/dev/null || echo "Response: $(curl -s "$BASE_URL/todos?status=in_progress")"

# Test 7: Delete todo
echo -e "\n7️⃣  Deleting todo with ID: $TODO_ID..."
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/todos/$TODO_ID")
echo "Delete response: $DELETE_RESPONSE"

# Test 8: Verify deletion
echo -e "\n8️⃣  Verifying deletion..."
curl -s "$BASE_URL/todos/$TODO_ID" | jq '.' 2>/dev/null || echo "Response: $(curl -s "$BASE_URL/todos/$TODO_ID")"

echo -e "\n✅ API testing completed!"
echo "=========================="
