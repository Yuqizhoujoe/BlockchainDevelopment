const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block {
    constructor({timestamp, lastHash, hash, data}) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    static genesis() {
        return new this(GENESIS_DATA);
    }

    static mineBlock({lastBlock, data}) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;

        return new this({
            hash: cryptoHash(timestamp, lastHash, data),
            timestamp,
            lastHash,
            data
        });
    }
}

const data = 'joejoedata';
const timestamp = '01/01/2020';
const lastHash = 'joejoelasthash';
const hash = 'joejoehash';

const block1 = new Block({data, timestamp, hash, lastHash});

console.log('block1', block1);

module.exports = Block;