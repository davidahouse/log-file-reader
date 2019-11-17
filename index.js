const fs = require("fs");
const lineReader = require("line-reader");

async function parseLog(fileName, options) {
  return new Promise(function(resolve, reject) {
    const results = [];
    let previousLine = null;
    let state = { totalKB: 0 };
    let lineNumber = 1;
    const readStream = openStream(fileName, options);
    lineReader.eachLine(readStream, function(line, last) {
      const capturedLine = captureLine(line, previousLine, options, state);
      if (capturedLine != null) {
        state = capturedLine.state;
        results.push({
          line: capturedLine.line,
          lineNumber: lineNumber
        });

        if (options.last != null) {
          if (results.length > options.last) {
            results.shift();
          }
        } else if (options.lastKB != null) {
          if (state.totalKB > options.lastKB) {
            const first = results.shift();
            state.totalKB = state.totalKB - first.line.length;
          }
        }
      }

      lineNumber += 1;
      previousLine = line;
      if (last) {
        resolve(results);
      }
    });
  });
}

function captureLine(line, previous, options, state) {
  if (options.includes != null) {
    if (line.match(options.includes) != null) {
      return {
        line: line,
        state: state
      };
    }
  } else if (options.first != null) {
    if (state.count == null || state.count < options.first) {
      let newState = state;
      newState.count = state.count == null ? 1 : state.count + 1;
      return {
        line: line,
        state: newState
      };
    }
  } else if (options.last != null) {
    return {
      line: line,
      state: state
    };
  } else if (options.firstKB != null) {
    if (state.totalKB + line.length <= options.firstKB) {
      const newState = state;
      newState.totalKB = state.totalKB + line.length;
      return {
        line: line,
        state: newState
      };
    }
  } else if (options.lastKB != null) {
    const newState = state;
    newState.totalKB = state.totalKB + line.length;
    return {
      line: line,
      state: newState
    };
  }

  return null;
}

function openStream(fileName, options) {
  var readStream = fs.createReadStream(fileName, {
    start: options.start,
    end: options.end
  });
  return readStream;
}

module.exports.parseLog = parseLog;
