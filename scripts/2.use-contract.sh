#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for environment variable with contract name"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

[ -z "$PLAYER1" ] && echo "Missing \$PLAYER1 environment variable" && exit 1
[ -z "$PLAYER1" ] || echo "Found it! \$PLAYER1 is set to [ $PLAYER1 ]"

[ -z "$PLAYER2" ] && echo "Missing \$PLAYER2 environment variable" && exit 1
[ -z "$PLAYER2" ] || echo "Found it! \$PLAYER2 is set to [ $PLAYER2 ]"

echo
echo
echo ---------------------------------------------------------
echo "Step 1: Creating player accounts and two dragons each"
echo
echo "(run this script again to see changes made by this file)"
echo ---------------------------------------------------------
echo

near call $CONTRACT create_account --accountId $PLAYER1
near call $CONTRACT create_account --accountId $PLAYER2

echo
echo

near call $CONTRACT dragon_create '{"account_id":"'$PLAYER1'"}' --accountId $CONTRACT
near call $CONTRACT dragon_create '{"account_id":"'$PLAYER1'"}' --accountId $CONTRACT

near call $CONTRACT dragon_create '{"account_id":"'$PLAYER2'"}' --accountId $CONTRACT
near call $CONTRACT dragon_create '{"account_id":"'$PLAYER2'"}' --accountId $CONTRACT

echo
echo
echo ---------------------------------------------------------
echo "Step 2: Players select their dragons"
echo ---------------------------------------------------------
echo

near call $CONTRACT dragon_select '{"dragon_id":"1"}' --accountId $PLAYER1
near call $CONTRACT dragon_select '{"dragon_id":"2"}' --accountId $PLAYER2

echo
echo
echo ---------------------------------------------------------
echo "Step 3: Battle!"
echo ---------------------------------------------------------
echo

near call $CONTRACT battle_start --accountId $CONTRACT

exit 0
