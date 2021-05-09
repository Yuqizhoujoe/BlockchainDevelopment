const Block = require('./block');
const cryptoHash = require('./crypto-hash');
const { GENESIS_DATA, MINE_RATE } = require('./config');

describe('Block', () => {
   const timestamp = 2000;
   const lastHash = 'foo-hash';
   const hash = 'bar-hash';
   const data = ['block-chain', 'data'];
   const nonce = 1;
   const difficulty = 1;
   const block = new Block({
       timestamp,
       data,
       hash,
       lastHash,
       nonce,
       difficulty
   });

   it('has a timestamp, lashHash, hash, and data property', () => {
      expect(block.timestamp).toEqual(timestamp);
      expect(block.data).toEqual(data);
      expect(block.hash).toEqual(hash);
      expect(block.lastHash).toEqual(lastHash);
      expect(block.nonce).toEqual(nonce);
      expect(block.difficulty).toEqual(difficulty);
   });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();


        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns genesis data', () => {
           expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({lastBlock, data});

        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `hash` of the lashBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it ('sets the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it ('sets a timestamp', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('create a SHA-256 `hash` based on the proper inputs', () => {
            expect(minedBlock.hash)
                .toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data, minedBlock.nonce, minedBlock.difficulty));
        });

        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(minedBlock.hash.substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty));
        });

        it('adjusts the difficulty', () => {
            const possibleResults = [lastBlock.difficulty+1, lastBlock.difficulty-1];

            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });
    });

    describe('adjustDifficulty()', () => {
       it('raise the difficulty for a quickly mined block', () => {
           expect(Block.adjustDifficulty({
               originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100
           })).toEqual(block.difficulty+1);
       });

       it('lower the difficulty for a quickly mined block', () => {
           expect(Block.adjustDifficulty({
               originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100
           })).toEqual(block.difficulty-1);
       });

       it('has a lower limit of 1', () => {
          block.difficulty = -1;

          expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
       });
    });
});