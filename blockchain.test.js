const BlockChain = require('./blockchain')
const Block = require('./block');

describe('BlockChain', () => {
    let blockChain, newChain, originalChain;

    beforeEach(() => {
       blockChain = new BlockChain();
       newChain = new BlockChain();

       originalChain = blockChain.chain;
    });

    it('contains a `chain` Array instance', () => {
        expect(blockChain.chain instanceof Array).toBe(true);
    });

    it ('start with a genesis block', () => {
        expect(blockChain.chain[0]).toEqual(Block.genesis());
    });

    it ('adds a new block to the chain', () => {
       const newData = 'foo bar';
       blockChain.addBlock({data: newData});

       expect(blockChain.chain[blockChain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('when the chain does not start with the genesi block', () => {
           it('returns false', () => {
               blockChain.chain[0] = {data: 'fake-genesis'};

               expect(BlockChain.isValidChain(blockChain.chain)).toBe(false);
           });
        });

        describe('when the chain starts with the genesis bloc and has multiple blocks', () => {


            beforeEach(() => {
                blockChain.addBlock({data: 'Bears'});
                blockChain.addBlock({data: 'Bears'});
                blockChain.addBlock({data: 'Battlestar Galatica'});
            });

           describe('and a lastHash reference has changed', () => {
               it('returns false', () => {
                   blockChain.chain[2].lastHash = 'broken-lastHash';

                   expect(BlockChain.isValidChain(blockChain.chain)).toBe(false);
               });
           });

            describe('and the chain contsins a block with an invalid field', () => {
                it('returns false', () => {
                    blockChain.chain[2].data = 'some-bad-and-evil-data';

                    expect(BlockChain.isValidChain(blockChain.chain)).toBe(false);
                });
            });

            describe('and the chain does not contain any invalid blocks', () => {
                it('returns true', () => {
                    expect(BlockChain.isValidChain(blockChain.chain)).toBe(true);
                });
            });
        });
    });

    describe('replaceChain', () => {
        describe('when the new chain is not longer', () => {
           it('does not replace the chain', () => {
               newChain.chain[0] = { new: 'chain' };

               blockChain.replaceChain(newChain.chain);

               expect(blockChain.chain).toEqual(originalChain);
           });
        });

        describe('when the chain is longer', () => {
            beforeEach(() => {
                newChain.addBlock({data: 'Bears'});
                newChain.addBlock({data: 'Bears'});
                newChain.addBlock({data: 'Battlestar Galatica'});
            });

           describe('and the chain is invalid', () => {
               it('does not replace the chain', () => {
                   newChain.chain[2].hash = 'some-fake-hash';

                   blockChain.replaceChain(newChain.chain);

                   expect(blockChain.chain).toEqual(originalChain);
               });
           });

           describe('and the chain is valid', () => {
               it('replaces the chain', () => {
                   blockChain.replaceChain(newChain.chain);

                   expect(blockChain.chain).toEqual(newChain.chian);
               });
           });
        });
    });
})