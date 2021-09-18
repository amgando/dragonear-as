# DragoNEAR in AssemblyScript

Transcribed from the original [DragoNEAR in Rust](https://github.com/ilblackdragon/dragonear)

Based on work by [theophoric](https://github.com/theophoric/near-core-contracts-as) in adapting NEAR core contracts


## Setup

1. run `./scripts/1.dev-deploy.sh`  \
   _(note that you will see some messages about `Missing ... environment variable` the first time you run this)_
   > sample: https://explorer.testnet.near.org/transactions/5Zup3iJsYPPPojcZ4YTn4ezLhHr1MQK9nZWAh7PjnEdG

2. setup environment variable for contract account  \
   `export CONTRACT=<dev-123-456>`

3. initialize the contract  \
   `near call $CONTRACT init '{"owner_id":"'$CONTRACT'"}' --accountId $CONTRACT`
   > sample: https://explorer.testnet.near.org/transactions/GFjc3f2J7df8h2gKgAPKm8eXpEZorPctSuFhSBcd6SWN

4. setup environment variables for game play  \
   `export PLAYER1=<some account>`
   `export PLAYER2=<another account>`

5. run `./scripts/2.use-contract.sh`


# 💥

```sh
	Failure [dev-1631945920580-30795013478292]: Error: {"index":0,"kind":{"ExecutionError":"WebAssembly trap: An `unreachable` opcode was executed."}}
```

---

## Testing

run `yarn test`


```sh
[Describe]: Contract

 [Success]: ✔ runs a basic battle

    [File]: src/dragonear/__tests__/index.unit.spec.ts
  [Groups]: 2 pass, 2 total
  [Result]: ✔ PASS
[Snapshot]: 0 total, 0 added, 0 removed, 0 different
 [Summary]: 1 pass,  0 fail, 1 total
    [Time]: 28.753ms

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  [Result]: ✔ PASS
   [Files]: 1 total
  [Groups]: 2 count, 2 pass
   [Tests]: 1 pass, 0 fail, 1 total
    [Time]: 14385.03ms
✨  Done in 15.00s.
```
