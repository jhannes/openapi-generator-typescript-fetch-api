/* eslint-disable no-case-declarations */
import {UpdateErrorDto} from "../../snapshot/poly";

function outputError(error: UpdateErrorDto): string {
    switch (error.code) {
        case "DuplicateIdentifierError":
            const {entityType, identifierValue} = error;
            return `duplicate id ${identifierValue} for ${entityType}`;
        case "GeneralError":
            const {description} = error;
            return description;
    }

    return "test";
}

