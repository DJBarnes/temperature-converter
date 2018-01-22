exports.render = function (req, res) {

    var formData;
    var formErrors;

    if (req.session.answer) {
        formData = req.session.answer;
    } else {
        formData = getFormDataObject();
    }

    if (req.session.formErrors) {
        formErrors = req.session.formErrors;
    } else {
        formErrors = getFormErrorObject();
    }

    req.session.answer = null;
    req.session.formErrors = null;

    res.render('index', {
        formData: formData,
        formErrors: formErrors
    });
};

exports.calculate = function (req, res) {

    var formErrors = validateRequest(req);

    if (formErrors.messages.length > 0) {
        req.session.formErrors = formErrors;
        res.redirect('/');
    } else {

        var formDataObject = getFormDataObject();

        //Do Conversion and figure out what the values in the formObject should be.

        formDataObject.amountToConvert = 0;
        formDataObject.fromUnit.celsius = 'checked';
        formDataObject.toUnit.farenheit = 'checked';
        formDataObject.convertedAnswer = 32;
        formDataObject.conversionFormula = 'F = C*(9/5)+32';

        req.session.answer = formDataObject;

        res.redirect('/');
    }
};

var getFormDataObject = function () {
    return {
        amountToConvert: '',
        fromUnit: {
            celsius: '',
            farenheit: '',
            kelvin: '',
            rankin: '',
        },
        toUnit: {
            celsius: '',
            farenheit: '',
            kelvin: '',
            rankin: '',
        },
        convertedAnswer: '',
        conversionFormula: '',
    };
};

var getFormErrorObject = function () {
    return {
        convertClass: '',
        fromClass: '',
        toClass: '',
        messages: []
    };
};

var validateRequest = function (req) {

    var errors = getFormErrorObject();

    if (!req.body.convertTemperature || req.body.convertTemperature === '') {
        errors.messages.push("You must enter an amount to convert.");
        errors.convertClass = 'is-invalid';
    }
    if (!req.body.fromRadios) {
        errors.messages.push("You must enter a 'From' unit.");
        errors.fromClass = 'is-invalid';
    }
    if (!req.body.toRadios) {
        errors.messages.push("You must enter a 'To' unit.");
        errors.toClass = 'is-invalid';
    }

    return errors;
};