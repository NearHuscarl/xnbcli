const BaseReader = require('./BaseReader');
const StringReader = require('./StringReader');
const Int32Reader = require('./Int32Reader');
const SingleReader = require('./SingleReader');
const CharReader = require('./CharReader');

/**
 * Boolean Reader
 * @class
 * @extends BaseReader
 */
class SFDAnimationReader extends BaseReader {
  /**
   * Reads Boolean from buffer.
   * @param {BufferReader} buffer
   * @returns {{}}
   */
  read(buffer) {
    const stringReader = new StringReader();
    const int32Reader = new Int32Reader();
    const singleReader = new SingleReader();
    const charReader = new CharReader()

    const length1 = int32Reader.read(buffer)
    const animations = []

    for (let index1 = 0; index1 < length1; index1++) {
      const name = stringReader.read(buffer)
      const length2 = int32Reader.read(buffer)
      const frames = []

      for (let index2 = 0; index2 < length2; index2++) {
        const frameEvent = stringReader.read(buffer)
        const time = int32Reader.read(buffer)
        const length3 = int32Reader.read(buffer)
        const collisions = []

        for (let index3 = 0; index3 < length3; index3++) {
          const id = int32Reader.read(buffer)
          const width = singleReader.read(buffer)
          const height = singleReader.read(buffer)
          const x = singleReader.read(buffer)
          const y = singleReader.read(buffer)
          collisions[index3] = { id, x, y, width, height }
        }

        const length4 = int32Reader.read(buffer)
        const parts = []

        for (let index3 = 0; index3 < length4; index3++) {
          const id = int32Reader.read(buffer)
          const x = singleReader.read(buffer)
          const y = singleReader.read(buffer)
          const rotation = singleReader.read(buffer)
          const flip = int32Reader.read(buffer)
          const sx = singleReader.read(buffer)
          const sy = singleReader.read(buffer)
          const postFix = stringReader.read(buffer)
          parts[index3] = { id, x, y, rotation, flip, sx, sy, postFix }
        }

        const num = charReader.read(buffer).charCodeAt()
        frames[index2] = { parts, collisions, frameEvent, time }
      }

      const num1 = charReader.read(buffer).charCodeAt()
      animations[index1] = { frames, name }
    }

    return {
      animations,
    }
  }

  /**
   * Writes Boolean into buffer
   * @param {BufferWriter} buffer
   * @param {Mixed} data
   * @param {ReaderResolver}
   */
  write(buffer, content, resolver) {
    this.writeIndex(buffer, resolver);
    buffer.writeByte(content);
  }
}

module.exports = SFDAnimationReader;
