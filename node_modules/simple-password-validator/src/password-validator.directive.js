const DEFAULT_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/g;

export default class AppPasswordValidator {
    constructor() {
        this.require = 'ngModel';
        this.restrict = 'A';
        this.scope = {
            password: '=',
            passwordRegex: '=?'
        };
    }

    link(scope, element, attributes, ngModel) {
        let regex = DEFAULT_REGEX;
        if (scope.passwordRegex) {
            regex = new RegExp(scope.passwordRegex, 'g');
        }
        ngModel.$validators.passswordValidator = (modelValue) => {
            return modelValue && modelValue.match(regex);
        };

        scope.$watch('ngModel', function() {
            ngModel.$validate();
        });
    }
}
