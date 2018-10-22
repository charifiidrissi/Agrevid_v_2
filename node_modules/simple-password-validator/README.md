# simple-password-validator #

[![Build Status](https://travis-ci.org/luanrubensf/simple-password-validator.svg?branch=master)](https://travis-ci.org/luanrubensf/simple-password-validator)

Simple password validator module to AngularJs.

We have 2 directives in this package:
* app-password-match
* app-password-validator

## How to use

Import the simple-password-validator module:

```javascript

import passwordValidator from 'simple-password-validator';

angular.module('myModule', [
    passwordValidator
]);

```

Use in the inputs tags:

```html

<input name="password" app-password-validator type="password" ng-model="vm.user.password" minlength="8" maxlength="30" required>

<input type="password" name="matchPassword" app-password-match password="vm.user.password" ng-model="vm.user.matchPassword" maxlength="30" required>

```

### app-password-match

This directive can be aplied to the match password. It receives a parameter called ```password``` to verify if it matches to the ```ng-model```.

### app-password-validator

The default validator regex is able to validate the fallowing rules:

* 1 uppercase character
* 1 lowercase character
* 1 digit

It's possible to pass the ```password-regex``` param, in order to specify a new regex rule to the password validar.