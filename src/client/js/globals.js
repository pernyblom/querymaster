var idCounter = 1;

var testTemplates = [];

var testsData = {
    testCollections: [
        {
            name: "Language",
            tests: [
                {
                    name: "Glossary I",
                    template: "SimpleGlossaryTemplate",
                    parameterValues: {
                        pairs: [["horse", "häst"], ["cat", "katt"], ["dog", "hund"], ["bird", "fågel"], ["mouse", "mus"]],
                        languages: ["English", "Swedish"],
                        reverse: false
                    }
                }
            ]
        },
        {
            name: "Math",
            tests: [
                {
                    name: "Multiplication",
                    template: "SimpleMathDualOperationTemplate",
                    parameterValues: {
                        firstValueFunctionDef: [
                            'function(test, operation) {',
                            '  return Math.round(Math.random() * 9 + 1);',
                            '}'
                        ],
                        secondValueFunctionDef: [
                            'function(test, operation, firstValue) {',
                            '  return Math.round(Math.random() * 9 + 1);',
                            '}'
                        ],
                        operations: [
                            {data: 'multiplication', likelihood: 1}
                        ],
                        timer: true,
                        statistics: true,
                        statisticsData: {},
                        highScore: true,
                        highScoreData: {id: "mathMultiplicationHighScore1"}
                    }
                },
                {
                    name: "Addition and Multiplication",
                    template: "SimpleMathDualOperationTemplate",
                    parameterValues: {
                        firstValueFunctionDef: [
                            'function(test, operation) {',
                            '  switch (operation) {',
                            '    case "addition":',
                            '      return Math.round(Math.random() * 99 + 1);',
                            '    case "multiplication":',
                            '      return Math.round(Math.random() * 9 + 1);',
                            '  }',
                            '  return 1;',
                            '}'
                        ],
                        secondValueFunctionDef: [
                            'function(test, operation, firstValue) {',
                            '  switch (operation) {',
                            '    case "addition":',
                            '      return Math.round(Math.random() * 99 + 1);',
                            '    case "multiplication":',
                            '      return Math.round(Math.random() * 9 + 1);',
                            '  }',
                            '  return 1;',
                            '}'
                        ],
                        operations: [
                            {data: 'multiplication', likelihood: 1},
                            {data: 'addition', likelihood: 1}
                        ]
                    }
                }
            ]
        }
    ]
};

var currentTestInfo = null;

var hasServer = false;
var serverDetectListeners = [];
function findServer() {
    hasServer = false;
    for (var i=0; i<serverDetectListeners.length; i++) {
        serverDetectListeners[i](hasServer);
    }
}

function findTemplate(name) {
    for (var i=0; i<testTemplates.length; i++) {
        var t = testTemplates[i];
        if (t._constructorName == name) {
            return t;
        }
    }
    return null;
}
