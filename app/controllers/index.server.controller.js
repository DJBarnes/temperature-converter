const CELSIUS = 1;
const FARENHEIT = 2;
const KELVIN = 3;
const RANKINE = 4;

exports.render = function (req, res) {

    var formData;
    var formErrors;

    if (req.session.formDataErrorObject) {
        formData = req.session.formDataErrorObject;
    } else {
        formData = getFormDataErrorObject();
    }

    req.session.formDataErrorObject = null;

    res.render('index', {
        formDataErrorObject: formData,
    });

};

exports.calculate = function (req, res) {

    var formDataErrorObject = getFormDataErrorObject();

    validateRequest(req, formDataErrorObject);

    console.log(formDataErrorObject);

    if (formDataErrorObject.formErrors.messages.length <= 0) {

        //Do the conversion and set the answer and formula
        convertTemperature(req.body, formDataErrorObject.formData);
    }

    //Add all of the form data to the session
    req.session.formDataErrorObject = formDataErrorObject;

    //Redirect back to the root
    res.redirect('/');

};

var getFormDataErrorObject = function () {
    return {
        formData: {
            amountToConvert: '',
            fromUnit: {
                celsius: '',
                farenheit: '',
                kelvin: '',
                rankine: '',
            },
            toUnit: {
                celsius: '',
                farenheit: '',
                kelvin: '',
                rankine: '',
            },
            convertedAnswer: '',
            conversionFormula: '',
        },
        formErrors: {
            convertClass: '',
            fromClass: '',
            toClass: '',
            messages: []
        }
    };
};

var validateRequest = function (req, formDataErrorObject) {

    if (req.body.convertTemperature && req.body.convertTemperature !== '') {
        formDataErrorObject.formData.amountToConvert = req.body.convertTemperature;
    } else {
        formDataErrorObject.formErrors.messages.push("You must enter an amount to convert.");
        formDataErrorObject.formErrors.convertClass = 'is-invalid';
    }
    if (req.body.fromRadios) {
        //Get the correct from radio
        determineWhichRadioWasSelected(req.body.fromRadios, formDataErrorObject.formData.fromUnit);
    } else {
        formDataErrorObject.formErrors.messages.push("You must enter a 'From' unit.");
        formDataErrorObject.formErrors.fromClass = 'is-invalid';
    }
    if (req.body.toRadios) {
        //Get the correct to radio
        determineWhichRadioWasSelected(req.body.toRadios, formDataErrorObject.formData.toUnit);
    } else {
        formDataErrorObject.formErrors.messages.push("You must enter a 'To' unit.");
        formDataErrorObject.formErrors.toClass = 'is-invalid';
    }

    if (req.body.fromRadios === req.body.toRadios) {
        formDataErrorObject.formErrors.messages.push("You must select different units to perform a conversion.");
        formDataErrorObject.formErrors.fromClass = 'is-invalid';
        formDataErrorObject.formErrors.toClass = 'is-invalid';
    }
};

var determineWhichRadioWasSelected = function (selectedRadioIndex, unit) {

    switch (Number(selectedRadioIndex)) {
        case CELSIUS:
            unit.celsius = 'checked';
            break;

        case FARENHEIT:
            unit.farenheit = 'checked';
            break;

        case KELVIN:
            unit.kelvin = 'checked';
            break;

        case RANKINE:
            unit.rankine = 'checked';
            break;
        default:
            console.log('****ERROR! Somehow did not match radio values****');
            break;
    }
};

var convertTemperature = function (body, formData) {
    switch (Number(body.fromRadios)) {
        case CELSIUS:
            convertCelsiusTo(body, formData);
            break;

        case FARENHEIT:
            convertFarenheitTo(body, formData);
            break;

        case KELVIN:
            convertKelvinTo(body, formData);
            break;

        case RANKINE:
            convertRankineTo(body, formData);
            break;
    }
};

var convertCelsiusTo = function (body, formData) {
    switch (Number(body.toRadios)) {

        case FARENHEIT:
            convertCelsiusToFarenheit(body, formData);
            break;

        case KELVIN:
            convertCelsiusToKelvin(body, formData);
            break;

        case RANKINE:
            convertCelsiusToRankine(body, formData);
            break;
    }
};

var convertFarenheitTo = function (body, formData) {
    switch (Number(body.toRadios)) {

        case CELSIUS:
            convertFarenheitToCelsius(body, formData);
            break;

        case KELVIN:
            convertFarenheitToKelvin(body, formData);
            break;

        case RANKINE:
            convertFarenheitToRankine(body, formData);
            break;
    }
};

var convertKelvinTo = function (body, formData) {
    switch (Number(body.toRadios)) {

        case CELSIUS:
            convertKelvinToCelsius(body, formData);
            break;

        case FARENHEIT:
            convertKelvinToFarenheit(body, formData);
            break;

        case RANKINE:
            convertKelvinToRankine(body, formData);
            break;
    }
};

var convertRankineTo = function (body, formData) {
    switch (Number(body.toRadios)) {

        case CELSIUS:
            convertRankineToCelsius(body, formData);
            break;

        case FARENHEIT:
            convertRankineToFarenheit(body, formData);
            break;

        case KELVIN:
            convertRankineToKelvin(body, formData);
            break;
    }
};

var convertCelsiusToFarenheit = function (body, formData) {
    var tempToConvert = body.convertTemperature;
    var result = (tempToConvert * (9.0 / 5.0)) + 32.0;
    formData.convertedAnswer = Number(tempToConvert).toFixed(2) +
        "°C = " + Number(result).toFixed(2) + "°F";
    formData.conversionFormula = "[°F] = ([°C] x (9/5)) + 32";
};

var convertCelsiusToKelvin = function (body, formData) {
    var tempToConvert = body.convertTemperature;
    var result = tempToConvert + 273.15;
    formData.convertedAnswer = Number(tempToConvert).toFixed(2) +
        "°C = " + Number(result).toFixed(2) + "°K";
    formData.conversionFormula = "[°K] = [°C] + 273.15";
};

var convertCelsiusToRankine = function (body, formData) {
    var tempToConvert = body.convertTemperature;
    var result = (tempToConvert + 273.15) * (9.0 / 5.0);
    formData.convertedAnswer = Number(tempToConvert).toFixed(2) +
        "°C = " + Number(result).toFixed(2) + "°R";
    formData.conversionFormula = "[°R] = ([°C] + 273.15) x (9/5)";
};



var convertFarenheitToCelsius = function (body, formData) {
    var tempToConvert = body.convertTemperature;
    var result = (tempToConvert - 32.0) / (9.0 / 5.0);
    formData.convertedAnswer = Number(tempToConvert).toFixed(2) +
        "°F = " + Number(result).toFixed(2) + "°C";
    formData.conversionFormula = "[°C] = ([°F] - 32) / (9/5)";
};

var convertFarenheitToKelvin = function (body, formData) {
    var tempToConvert = body.convertTemperature;
    var result = (tempToConvert + 459.67) / (9.0 / 5.0);
    formData.convertedAnswer = Number(tempToConvert).toFixed(2) +
        "°F = " + Number(result).toFixed(2) + "°K";
    formData.conversionFormula = "[°K] = ([°F] + 459.67) / (9/5)";
};

var convertFarenheitToRankine = function (body, formData) {
    var tempToConvert = body.convertTemperature;
    var result = tempToConvert + 459.67;
    formData.convertedAnswer = Number(tempToConvert).toFixed(2) +
        "°F = " + Number(result).toFixed(2) + "°R";
    formData.conversionFormula = "[°R] = [°F] + 459.67";
};



var convertKelvinToCelsius = function (body, formData) {
    var tempToConvert = body.convertTemperature;
    var result = tempToConvert - 273.15;
    formData.convertedAnswer = Number(tempToConvert).toFixed(2) +
        "°K = " + Number(result).toFixed(2) + "°C";
    formData.conversionFormula = "[°C] = [°K] - 273.15";
};

var convertKelvinToFarenheit = function (body, formData) {
    var tempToConvert = body.convertTemperature;
    var result = (tempToConvert * (9.0 / 5.0)) - 459.67;
    formData.convertedAnswer = Number(tempToConvert).toFixed(2) +
        "°K = " + Number(result).toFixed(2) + "°F";
    formData.conversionFormula = "[°F] = ([°K] x (9/5) - 459.67";
};

var convertKelvinToRankine = function (body, formData) {
    var tempToConvert = body.convertTemperature;
    var result = tempToConvert * (9.0 / 5.0);
    formData.convertedAnswer = Number(tempToConvert).toFixed(2) +
        "°K = " + Number(result).toFixed(2) + "°R";
    formData.conversionFormula = "[°R] = [°K] x (9/5)";
};



var convertRankineToCelsius = function (body, formData) {
    var tempToConvert = body.convertTemperature;
    var result = tempToConvert - 491.67 * (5.0 / 9.0);
    formData.convertedAnswer = Number(tempToConvert).toFixed(2) +
        "°R = " + Number(result).toFixed(2) + "°C";
    formData.conversionFormula = "[°C] = ([°R] - (32 + 459.67)) × (5/9)";
};

var convertRankineToFarenheit = function (body, formData) {
    var tempToConvert = body.convertTemperature;
    var result = tempToConvert - 459.67;
    formData.convertedAnswer = Number(tempToConvert).toFixed(2) +
        "°R = " + Number(result).toFixed(2) + "°F";
    formData.conversionFormula = "[°F] = [°R] - 459.67";
};

var convertRankineToKelvin = function (body, formData) {
    var tempToConvert = body.convertTemperature;
    var result = tempToConvert * (5.0 / 9.0);
    formData.convertedAnswer = Number(tempToConvert).toFixed(2) +
        "°R = " + Number(result).toFixed(2) + "°K";
    formData.conversionFormula = "[°K] = [°R] x (5/9)";
};