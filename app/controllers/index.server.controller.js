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

        formDataErrorObject.formData.convertedAnswer = 32;
        formDataErrorObject.formData.conversionFormula = 'F = C*(9/5)+32';
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
    //
};

var convertCelsiusToKelvin = function (body, formData) {
    //
};

var convertCelsiusToRankine = function (body, formData) {
    //
};

var convertFarenheitToCelsius = function (body, formData) {
    //
};

var convertFarenheitToKelvin = function (body, formData) {
    //
};

var convertFarenheitToRankine = function (body, formData) {
    //
};

var convertKelvinToCelsius = function (body, formData) {
    //
};

var convertKelvinToFarenheit = function (body, formData) {
    //
};

var convertKelvinToRankine = function (body, formData) {
    //
};

var convertRankineToCelsius = function (body, formData) {
    //
};

var convertRankineToFarenheit = function (body, formData) {
    //
};

var convertRankineToKelvin = function (body, formData) {
    //
};