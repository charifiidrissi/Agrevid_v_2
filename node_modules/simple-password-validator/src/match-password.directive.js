export default class AppMatchPassword {
    constructor() {
        this.require = 'ngModel';
        this.restrict = 'A';
        this.scope = {
            password: '='
        };
    }

    link(scope, element, attributes, ngModel) {
        ngModel.$validators.matchPassword = (modelValue) => {
            return modelValue === scope.password;
        };

        scope.$watch("password", function() {
            ngModel.$validate();
        });
    }
}
