// So constants that can be used to check the value of the
// to and from radio groups when determining which one was selected.
const CELSIUS = 1;
const FARENHEIT = 2;
const KELVIN = 3;
const RANKINE = 4;

// GET method to display the temperature conversion form
exports.render = function (req, res) {

    // Declare the formDataErrorObject that will contain all of the
    // information needed for rendering the form both with and without
    // data from a submission of this form.
    var formDataErrorObject;

    // If there is a formDataErrorObject in the session
    if (req.session.formDataErrorObject) {
        // Set the formDataErrorObject to the one from the session
        formDataErrorObject = req.session.formDataErrorObject;
    } else {
        // Else, set the formDataErrorObject to a default version
        // that is obtained by calling the getFormDataErrorObject method
        formDataErrorObject = getFormDataErrorObject();
    }

    // Regardless of whether or not we pulled out a formDataErrorObject
    // from the the session, we will set the session's formDataErrorObject
    // to null to ensure that a page refresh will populate the form with
    // empty data instead of what may still be hangin around in the session.
    req.session.formDataErrorObject = null;

    // Render out the index view and send over the formDataErrorObject
    // to the view so that it can be used to display the submitted fields
    // and calculated answers in the view.
    // If the formDataErrorObject was not pulled from the session with
    // stored form data, it will have no effect on the form when rendering it.
    res.render('index', {
        formDataErrorObject: formDataErrorObject,
    });

};

// POST method to accept the submitted form data,
// calculate the answer and formula,
// store the answer in a formDataErrorObject,
// place the formDataErrorObject in the session,
// and finally redirect back to the index GET method.
exports.calculate = function (req, res) {

    // Get the default formDataErrorObject from the getFormDataErrorObject method
    var formDataErrorObject = getFormDataErrorObject();

    // Run the request through the validation function. Pass the formDataErrorObject
    // to the method so that any validation errors can be entered into that object.
    validateRequest(req, formDataErrorObject);

    // If the number of messages in the formErrors object of the
    // formDataErrorObject is less than or equal to zero, we can
    // convert the entered temperature.
    if (formDataErrorObject.formErrors.messages.length <= 0) {

        // Do the conversion and set the answer and formula on the
        // formData object that is passed into this method.
        convertTemperature(req.body, formDataErrorObject.formData);
    }

    // Add all of the form data to the session under the session
    // property of formDataErrorObject.
    req.session.formDataErrorObject = formDataErrorObject;

    // Redirect back to the root route, will will call the GET
    // method listed above. In that method, it will check for the
    // formDataErrorObject we just put into the session.
    res.redirect('/');

};

// Returns the default getFormDataErrorObject that will be used when
// rendering out the view.
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

// Method to validate the request and ensure that all fields were filled out.
// If any of the validatin fails, the errors will be put into the formErrors
// object of the formDataErrorObject.
var validateRequest = function (req, formDataErrorObject) {

    // If the the convertTemperature field is not empty, set the
    // amountToConvert on the formData object of the formDataErrorObject.
    if (req.body.convertTemperature && req.body.convertTemperature !== '') {
        formDataErrorObject.formData.amountToConvert = req.body.convertTemperature;
    } else {
        // Else, add an error message to the messages property and set the convertClass to is-invalid
        formDataErrorObject.formErrors.messages.push("You must enter an amount to convert.");
        formDataErrorObject.formErrors.convertClass = 'is-invalid';
    }
    // If the fromRadios field is not empty, set the fromUnit on the formData object
    if (req.body.fromRadios) {
        determineWhichRadioWasSelected(req.body.fromRadios, formDataErrorObject.formData.fromUnit);
    } else {
        // Else, add an error message to the messages property and set the fromClass to is-invalid
        formDataErrorObject.formErrors.messages.push("You must enter a 'From' unit.");
        formDataErrorObject.formErrors.fromClass = 'is-invalid';
    }
    // If the toRadios field is not empty, set the toUnit on the formData object.
    if (req.body.toRadios) {
        determineWhichRadioWasSelected(req.body.toRadios, formDataErrorObject.formData.toUnit);
    } else {
        // Else, add an error message to the message property and set the toClass to is-invalid
        formDataErrorObject.formErrors.messages.push("You must enter a 'To' unit.");
        formDataErrorObject.formErrors.toClass = 'is-invalid';
    }
    // If the fromRadios and toRadios are the same, set an error message, and
    // set both toClass and fromClass to is-invalid
    if (req.body.fromRadios === req.body.toRadios) {
        formDataErrorObject.formErrors.messages.push("You must select different units to perform a conversion.");
        formDataErrorObject.formErrors.fromClass = 'is-invalid';
        formDataErrorObject.formErrors.toClass = 'is-invalid';
    }
};

// Method to determine which radio was selected. This method will be used
// by the validation above to set the selected unit to 'checked'. It sets
// it to 'checked' so that it can be rendered out in the view as is. This
// will allow the correct radio to remain checked when rendering the view.
var determineWhichRadioWasSelected = function (selectedRadioIndex, unit) {

    //Switch on the selectedRadioIndex
    switch (Number(selectedRadioIndex)) {
        //Case CELSIUS denoted by the constant
        case CELSIUS:
            //Set the unit.celsius to 'checked'
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

/*
 |----------------------------------------------------------------------
 | Methods to do the actual conversion from one temp to the other below
 |----------------------------------------------------------------------
 */

// Method to convert the temperature and assign the result
// and formula to the formData object that can be rendered out
// in the view.
var convertTemperature = function (body, formData) {
    // Switch on the fromRadio
    switch (Number(body.fromRadios)) {
        // Case CELSIUS
        case CELSIUS:
            // Call the convertCelsiusTo method to do the rest of the conversion.
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

// Method to read the toRadio and determine what we are converting
// Celsius to.
var convertCelsiusTo = function (body, formData) {
    // Switch on the toRadio
    switch (Number(body.toRadios)) {
        // Case FARENHEIT
        case FARENHEIT:
            // Call the convertCelsiusToFarenheit method.
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