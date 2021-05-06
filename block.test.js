const Block = require('./block');
const cryptoHash = require('./crypto-hash');
const { GENESIS_DATA } = require('./config');

describe('Block', () => {
   const timestamp = 'a-date';
   const lastHash = 'foo-hash';
   const hash = 'bar-hash';
   const data = ['block-chain', 'data'];
   const block = new Block({
       timestamp: timestamp,
       data: data,
       hash: hash,
       lastHash: lastHash
   });

   it('has a timestamp, lashHash, hash, and data property', () => {
      expect(block.timestamp).toEqual(timestamp);
      expect(block.data).toEqual(data);
      expect(block.hash).toEqual(hash);
      expect(block.lastHash).toEqual(lastHash);
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
                .toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data));
        });
    });
});