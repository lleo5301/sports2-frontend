#!/bin/bash

echo "Running Scouting Reports Tests..."

# Run just a few key tests to verify functionality
echo "1. Running basic scouting reports test..."
npx playwright test tests/scouting-reports.spec.js --grep "should display scouting reports section when viewing a player" --reporter=list

echo "2. Running integration test..."
npx playwright test tests/scouting-reports-integration.spec.js --grep "complete user journey" --reporter=list

echo "3. Running performance test..."
npx playwright test tests/performance-scouting-reports.spec.js --grep "player modal opens within performance budget" --reporter=list

echo "Testing complete!"
