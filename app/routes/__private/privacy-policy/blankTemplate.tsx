import cloneDeep from "lodash.clonedeep";

const attributeTypeList = [
  {
    attributeTypeValueList: [{ enum: "TRUE" }, { enum: "FALSE" }],
    defaultValue: "FALSE",
    enum: "COLLECTED_BY_SERVICE",
    jsonSchema: { type: "boolean" },
    name: "Collected by service"
  },
  {
    attributeTypeValueList: [{ enum: "TRUE" }, { enum: "FALSE" }],
    defaultValue: "FALSE",
    enum: "STORED_BY_SERVICE",
    jsonSchema: { type: "boolean" },
    name: "Stored by service"
  },
  {
    attributeTypeValueList: [{ enum: "TRUE" }, { enum: "FALSE" }],
    defaultValue: "FALSE",
    enum: "PROVIDED_TO_3RD_PARTIES",
    jsonSchema: { type: "boolean" },
    name: "Provided to 3rd parties"
  }
];

export const attributeList = [
  {
    attributeTypeEnum: "COLLECTED_BY_SERVICE",
    attributeTypeValueEnum: "FALSE",
    value: null
  },
  {
    attributeTypeEnum: "STORED_BY_SERVICE",
    attributeTypeValueEnum: "FALSE",
    value: null
  },
  {
    attributeTypeEnum: "PROVIDED_TO_3RD_PARTIES",
    attributeTypeValueEnum: "FALSE",
    value: null
  }
];

export const blankTemplate: { [key: string]: any } = {
  PHYSICAL: {
    dataElementList: [
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "PHYSICAL",
        enum: "AGE",
        name: "Age",
        severityLevel: 0
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "PHYSICAL",
        enum: "BLOOD_TYPE",
        name: "Blood Type",
        severityLevel: 0
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "PHYSICAL",
        enum: "GENDER",
        name: "Gender",
        severityLevel: 0
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "PHYSICAL",
        enum: "RACE",
        name: "Race",
        severityLevel: 0
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "PHYSICAL",
        enum: "HEIGHT",
        name: "Height",
        severityLevel: 0
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "PHYSICAL",
        enum: "WEIGHT",
        name: "Weight",
        severityLevel: 0
      }
    ],
    attributeTypeList: [...attributeTypeList]
  },
  MEDICAL: {
    dataElementList: [
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "MEDICAL",
        enum: "DRUG_TEST_RESULT",
        name: "Drug Test Result",
        severityLevel: 4
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "MEDICAL",
        enum: "FAMILY_HEALTH_HISTORY",
        name: "Family Health History",
        severityLevel: 5
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "MEDICAL",
        enum: "HEALTH_HISTORY",
        name: "Health History",
        severityLevel: 5
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "MEDICAL",
        enum: "HEALTH_RECORD",
        name: "Health Record",
        severityLevel: 7
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "MEDICAL",
        enum: "MEDICAL_TESTING",
        name: "Medical Testing",
        severityLevel: 7
      }
    ],
    attributeTypeList: [...attributeTypeList]
  },
  CYBERIDENTIFIERS: {
    dataElementList: [
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "CYBERIDENTIFIERS",
        enum: "BIRTH_DATE",
        name: "Birth Date",
        severityLevel: 0
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "CYBERIDENTIFIERS",
        enum: "DEVICE_OPERATING_SYSTEM",
        name: "Device Operating System",
        severityLevel: 0
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "CYBERIDENTIFIERS",
        enum: "EMAIL_ADDRESS",
        name: "Email Address",
        severityLevel: 2
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "CYBERIDENTIFIERS",
        enum: "FAX_NUMBER",
        name: "Fax Number",
        severityLevel: 0
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "CYBERIDENTIFIERS",
        enum: "IP_ADDRESS",
        name: "IP Address",
        severityLevel: 0
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "CYBERIDENTIFIERS",
        enum: "PHONE_NUMBER",
        name: "Phone Number",
        severityLevel: 6
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "CYBERIDENTIFIERS",
        enum: "MAC_ADDRESS",
        name: "MAC Address",
        severityLevel: 6
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "CYBERIDENTIFIERS",
        enum: "PERSONAL_IDENTIFICATION_NUMBER_PIN",
        name: "Personal Identification Number (PIN)",
        severityLevel: 6
      }
    ],
    attributeTypeList: [...attributeTypeList]
  },
  GEOSPATIAL: {
    dataElementList: [
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "GEOSPATIAL",
        enum: "ADDRESS_HOME",
        name: "Address - Home",
        severityLevel: 3
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "GEOSPATIAL",
        enum: "COUNTRY",
        name: "Country",
        severityLevel: 1
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "GEOSPATIAL",
        enum: "CURRENT_LOCATION",
        name: "Current Location",
        severityLevel: 5
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "GEOSPATIAL",
        enum: "ADDRESS_EMPLOYMENT",
        name: "Address - Employment",
        severityLevel: 3
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "GEOSPATIAL",
        enum: "LOCATION_HISTORY",
        name: "Location History",
        severityLevel: 1
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "GEOSPATIAL",
        enum: "PROXIMITY_PEOPLE",
        name: "Proximity - People",
        severityLevel: 0
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "GEOSPATIAL",
        enum: "PROXIMITY_HISTORY",
        name: "Proximity - History",
        severityLevel: 0
      }
    ],
    attributeTypeList: [...attributeTypeList]
  },
  SOCIAL: {
    dataElementList: [
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "SOCIAL",
        enum: "ACQUAINTANCE",
        name: "Acquaintance",
        severityLevel: 2
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "SOCIAL",
        enum: "ASSOCIATION",
        name: "Association",
        severityLevel: 2
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "SOCIAL",
        enum: "COMMUNICATION",
        name: "Communication",
        severityLevel: 1
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "SOCIAL",
        enum: "DIVORCE",
        name: "Divorce",
        severityLevel: 1
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "SOCIAL",
        enum: "MARITAL_STATUS",
        name: "Marital Status",
        severityLevel: 1
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "SOCIAL",
        enum: "POLITICAL_AFFILIATION",
        name: "Political Affiliation",
        severityLevel: 1
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "SOCIAL",
        enum: "RELIGION",
        name: "Religion",
        severityLevel: 1
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "SOCIAL",
        enum: "DATING_STATUS",
        name: "Dating Status",
        severityLevel: 1
      }
    ],
    attributeTypeList: [...attributeTypeList]
  },
  REPRESENTATION: {
    dataElementList: [
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "REPRESENTATION",
        enum: "BEHAVIORAL",
        name: "Behavioral",
        severityLevel: 3
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "REPRESENTATION",
        enum: "CONSUMER_PREFERENCES",
        name: "Consumer Preferences",
        severityLevel: 2
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "REPRESENTATION",
        enum: "DEMEANOR",
        name: "Demeanor",
        severityLevel: 4
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "REPRESENTATION",
        enum: "LITERACY_LEVEL",
        name: "Literacy Level",
        severityLevel: 3
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "REPRESENTATION",
        enum: "MILITARY_EXPERIENCE",
        name: "Military Experience",
        severityLevel: 3
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "REPRESENTATION",
        enum: "CRIMINAL_BEHAVIOR",
        name: "Criminal Behavior",
        severityLevel: 3
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "REPRESENTATION",
        enum: "GENDER_IDENTIFICATION",
        name: "Gender Identification",
        severityLevel: 3
      }
    ],
    attributeTypeList: [...attributeTypeList]
  },
  PERSONAL: {
    dataElementList: [
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "PERSONAL",
        enum: "ATTITUDE",
        name: "Attitude",
        severityLevel: 0
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "PERSONAL",
        enum: "EXERCISE_HABITS",
        name: "Exercise Habits",
        severityLevel: 0
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "PERSONAL",
        enum: "PERSONALITY",
        name: "Personality",
        severityLevel: 0
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "PERSONAL",
        enum: "EDUCATION_LEVEL",
        name: "Education Level",
        severityLevel: 0
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "PERSONAL",
        enum: "HOBBIES",
        name: "Hobbies",
        severityLevel: 0
      }
    ],
    attributeTypeList: [...attributeTypeList]
  },
  FINANCIAL: {
    dataElementList: [
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "FINANCIAL",
        enum: "BANK_ACCOUNT",
        name: "Bank Account",
        severityLevel: 9
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "FINANCIAL",
        enum: "DEBTS",
        name: "Debts",
        severityLevel: 9
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "FINANCIAL",
        enum: "INVESTMENTS",
        name: "Investments",
        severityLevel: 7
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "FINANCIAL",
        enum: "LOAN_RECORD",
        name: "Loan Record",
        severityLevel: 7
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "FINANCIAL",
        enum: "SALARY",
        name: "Salary",
        severityLevel: 5
      },
      {
        attributeList: cloneDeep(attributeList),
        dataTypeEnum: "FINANCIAL",
        enum: "CREDIT_SCORE",
        name: "Credit Score",
        severityLevel: 5
      }
    ],
    attributeTypeList: [...attributeTypeList]
  }
};
