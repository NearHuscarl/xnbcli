const BaseReader = require('./BaseReader');
const BufferReader = require('../../BufferReader');
const Int32Reader = require('./Int32Reader');

/**
 * Rectangle Reader
 * @class
 * @extends BaseReader
 */
class ColorReader extends BaseReader {
    /**
     * Reads Rectangle from buffer.
     * @param {BufferReader} buffer
     * @returns {{a: Number, r: Number, b: Number, g: Number}}
     */
    read(buffer) {
        const r = buffer.readByte();
        const g = buffer.readByte();
        const b = buffer.readByte();
        const a = buffer.readByte();

        return { r, g, b, a };
    }

    /**
     * Writes Effects into the buffer
     * @param {BufferWriter} buffer
     * @param {{a: Number, r: Number, b: Number, g: Number}} content The data
     * @param {ReaderResolver} resolver
     */
    write(buffer, content, resolver) {
        this.writeIndex(buffer, resolver);
        buffer.writeByte(content.r)
        buffer.writeByte(content.g)
        buffer.writeByte(content.b)
        buffer.writeByte(content.a)
    }
}

module.exports = ColorReader;
