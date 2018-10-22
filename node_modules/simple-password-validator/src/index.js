import angular from 'angular';

import appPasswordMatch from './match-password.directive';
import appPasswordValidator from './password-validator.directive';

const MODULE_NAME = 'password-validator';

angular.module(MODULE_NAME, [])
    .directive('appPasswordMatch', () => new appPasswordMatch)
    .directive('appPasswordValidator', () => new appPasswordValidator);

export default MODULE_NAME;