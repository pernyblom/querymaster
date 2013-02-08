var idCounter = 1;

var testTemplates = [];



var testsData = {
    testCategories: [
        {
            name: "Language",
            testInfos: [
                {
                    name: "Glossary I",
                    description: "A simple glossary test for English and Swedish",
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
            testInfos: [
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

var testInfoToEdit = null;

var activeTestIndexInfos = [];

var activeCategoryIndex = null;

var confirmInfo = new ConfirmInfo();

var saveTestBackSteps = 1;

var customTestParameters = {};

var language = "en";
var localizationData = null;

var hasServer = false;
var serverDetectListeners = [];


