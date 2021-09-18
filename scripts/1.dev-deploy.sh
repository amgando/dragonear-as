#!/usr/bin/env bash

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable"
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable"
[ -z "$OWNER" ] || echo "Found it! \$OWNER is set to [ $OWNER ]"

near delete $CONTRACT $OWNER
rm -rf ./neardev

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 1: Build the contract (may take a few seconds)"
echo ---------------------------------------------------------
echo

yarn build:release

echo
echo
echo ---------------------------------------------------------
echo "Step 2: Deploy the contract"
echo
echo "(edit scripts/1.dev-deploy.sh to deploy other contract)"
echo ---------------------------------------------------------
echo

near dev-deploy ./build/release/dragonear.wasm

echo
echo
echo ---------------------------------------------------------
echo "Step 3: Prepare your environment for next steps"
echo
echo "(a) find the contract (account) name in the message above"
echo "    it will look like this: [ Account id: dev-###-### ]"
echo
echo "(b) set an environment variable using this account name"
echo "    see example below (this may not work on Windows)"
echo
echo ---------------------------------------------------------
echo "export CONTRACT=<dev-123-456>"
echo "near call \$CONTRACT init '{\"owner_id\":\"'\$CONTRACT'\"}' --accountId \$CONTRACT"
echo ---------------------------------------------------------
echo

exit 0
