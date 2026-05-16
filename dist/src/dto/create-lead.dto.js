"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLeadDto = exports.IsValidEmailDomainConstraint = void 0;
exports.IsValidEmailDomain = IsValidEmailDomain;
const class_validator_1 = require("class-validator");
const dns = __importStar(require("dns"));
const util_1 = require("util");
const resolveMx = (0, util_1.promisify)(dns.resolveMx);
let IsValidEmailDomainConstraint = class IsValidEmailDomainConstraint {
    async validate(email, args) {
        if (!email || typeof email !== 'string' || !email.includes('@'))
            return false;
        const domain = email.split('@')[1];
        if (!domain)
            return false;
        try {
            const records = await resolveMx(domain);
            return records && records.length > 0;
        }
        catch (e) {
            return false;
        }
    }
    defaultMessage(args) {
        return 'Email domain does not exist or cannot receive emails';
    }
};
exports.IsValidEmailDomainConstraint = IsValidEmailDomainConstraint;
exports.IsValidEmailDomainConstraint = IsValidEmailDomainConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: true })
], IsValidEmailDomainConstraint);
function IsValidEmailDomain(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidEmailDomainConstraint,
        });
    };
}
class CreateLeadDto {
    name;
    email;
    interest;
    message;
    date;
    time;
}
exports.CreateLeadDto = CreateLeadDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'Name is too short' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Name is too long' }),
    (0, class_validator_1.Matches)(/^\S+\s+\S+/, { message: 'Please provide both first and last name' }),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    IsValidEmailDomain({ message: 'Email domain does not exist or cannot receive emails' }),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Interest is required' }),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "interest", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Message is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'Message should be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(1000, { message: 'Message is too long' }),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "time", void 0);
//# sourceMappingURL=create-lead.dto.js.map