const BaseReader = require('./BaseReader');
const BufferReader = require('../../BufferReader');
const BufferWriter = require('../../BufferWriter');
const BooleanReader = require('./BooleanReader');
const StringReader = require('./StringReader');
const Int32Reader = require('./Int32Reader');
const ColorReader = require('./ColorReader');
const CharReader = require('./CharReader');
const Texture2DReader = require('./Texture2DReader');

/**
 * Boolean Reader
 * @class
 * @extends BaseReader
 */
class SFDItemReader extends BaseReader {
  /**
   * Reads Boolean from buffer.
   * @param {BufferReader} buffer
   * @returns {{}}
   */
  read(buffer) {
    const booleanReader = new BooleanReader();
    const stringReader = new StringReader();
    const int32Reader = new Int32Reader();
    const colorReader = new ColorReader();
    const charReader = new CharReader();

    const fileName = stringReader.read(buffer)
    const gameName = stringReader.read(buffer)
    const equipmentLayer = int32Reader.read(buffer)
    const id = stringReader.read(buffer)
    const jacketUnderBelt = booleanReader.read(buffer)
    const canEquip = booleanReader.read(buffer)
    const canScript = booleanReader.read(buffer)
    const colorPalette = stringReader.read(buffer)
    const width = int32Reader.read(buffer)
    const height = int32Reader.read(buffer)

    const num1 = buffer.readByte()
    const dynamicColorTable = []

    for (let i = 0; i < num1; i++) {
      dynamicColorTable.push(colorReader.read(buffer))
    }

    const length1 = int32Reader.read(buffer)
    const num2 = charReader.read(buffer).charCodeAt()
    const parts = []

    for (let index1 = 0; index1 < length1; index1++) {
      const type = int32Reader.read(buffer)
      const length2 = int32Reader.read(buffer)
      const size = width * height
      const textures = []

      for (let index2 = 0; index2 < length2; index2++) {
        if (booleanReader.read(buffer)) {
          const defaultColor = { r: 0, g: 0, b: 0, a: 0 }
          const data = []
          let emptyImage = true

          for (let index3 = 0; index3 < size * 4; index3 += 4) {
            if (booleanReader.read(buffer)) {
              data[index3] = defaultColor.r
              data[index3 + 1] = defaultColor.g
              data[index3 + 2] = defaultColor.b
              data[index3 + 3] = defaultColor.a
            } else {
              const num3 = buffer.readByte()
              emptyImage = false
              data[index3] = dynamicColorTable[num3].r
              data[index3 + 1] = dynamicColorTable[num3].g
              data[index3 + 2] = dynamicColorTable[num3].b
              data[index3 + 3] = dynamicColorTable[num3].a
            }
          }

          const num4 = charReader.read(buffer).charCodeAt()

          if (emptyImage) {
            textures[index2] = null
          } else {
            textures[index2] = { data, width, height }
          }
        } else {
          textures[index2] = null
        }
      }

      parts[index1] = { textures, type }
    }

    return {
      parts,
      gameName,
      fileName,
      equipmentLayer,
      id,
      jacketUnderBelt,
      canEquip,
      canScript,
      colorPalette,
      export: {
        type: 'SFDItem',
        data: parts
      }
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

module.exports = SFDItemReader;


// Equipment.GetText()
// public static string GetText(int layer)
// {
//   switch (layer)
//   {
//     case 0:
//       return LanguageHelper.GetText("equipment.layer.skin");
//     case 1:
//       return LanguageHelper.GetText("equipment.layer.chestUnder");
//     case 2:
//       return LanguageHelper.GetText("equipment.layer.legs");
//     case 3:
//       return LanguageHelper.GetText("equipment.layer.waist");
//     case 4:
//       return LanguageHelper.GetText("equipment.layer.feet");
//     case 5:
//       return LanguageHelper.GetText("equipment.layer.chestOver");
//     case 6:
//       return LanguageHelper.GetText("equipment.layer.accessory");
//     case 7:
//       return LanguageHelper.GetText("equipment.layer.hands");
//     case 8:
//       return LanguageHelper.GetText("equipment.layer.head");
//     case 9:
//       return "X";
//     default:
//       return LanguageHelper.GetText("genera.none");
//   }
// }
// }
