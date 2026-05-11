// src/utils/validateInstitute.js
// Changes from old version:
// - street_address field added (required)
// - location_country removed from validation (always "India", set internally)
// - location_country still present in initialInstituteState (set to "India")

export const validateInstitute = (institute) => {
  const errors = {};

  const stringRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const numberRegex = /^\d+$/;
  const phoneRegex = /^\d{10}$/;

  // Institute Name
  if (!institute.institute_name?.trim()) {
    errors.institute_name = "Institute name is required";
  } else if (!stringRegex.test(institute.institute_name)) {
    errors.institute_name = "Institute name must contain only letters";
  }

  // Institute Email
  if (!institute.institute_email?.trim()) {
    errors.institute_email = "Institute email is required";
  } else if (!emailRegex.test(institute.institute_email)) {
    errors.institute_email = "Invalid email format";
  }

  // Contact Person Name
  if (!institute.contact_person_name?.trim()) {
    errors.contact_person_name = "Contact person name is required";
  } else if (!stringRegex.test(institute.contact_person_name)) {
    errors.contact_person_name = "Name must contain only letters";
  }

  // Contact Person Designation
  if (!institute.contact_person_designation?.trim()) {
    errors.contact_person_designation = "Designation is required";
  } else if (!stringRegex.test(institute.contact_person_designation)) {
    errors.contact_person_designation = "Designation must contain only letters";
  }

  // Contact Phone
  if (!institute.contact_phone?.trim()) {
    errors.contact_phone = "Contact phone is required";
  } else if (!phoneRegex.test(institute.contact_phone)) {
    errors.contact_phone = "Phone number must be 10 digits";
  }

  // Institute Type
  if (!institute.institute_type?.trim()) {
    errors.institute_type = "Institute type is required";
  } else if (!stringRegex.test(institute.institute_type)) {
    errors.institute_type = "Institute type must contain only letters";
  }

  // PIN Code
  if (!institute.location_pin?.trim()) {
    errors.location_pin = "PIN code is required";
  } else if (!numberRegex.test(institute.location_pin) || institute.location_pin.length !== 6) {
    errors.location_pin = "PIN must be a valid 6-digit number";
  }

  // State
  if (!institute.location_state?.trim()) {
    errors.location_state = "State is required";
  }

  // City
  if (!institute.location_city?.trim()) {
    errors.location_city = "City is required";
  }

  // Street / Locality — NEW field
  if (!institute.street_address?.trim()) {
    errors.street_address = "Street / locality is required";
  }

  // NOTE: location_country is NOT validated here — it is always forced to
  // "India" internally by SmartLocationFields on mount and PIN lookup.
  // No need for user to provide or validate it.

  return errors;
};

export const initialInstituteState = {
  institute_name: "",
  institute_display_name: "",
  institute_email: "",
  support_email: "",
  contact_person_name: "",
  contact_person_designation: "",
  contact_phone: "",
  contact_phone_alt: "",
  institute_type: "",
  location_city: "",
  location_state: "",
  location_country: "India",   // Pre-set to India, never changes
  location_pin: "",
  street_address: "",           // NEW — street/locality for geocoding
  latitude: "",
  longitude: "",
  admin_notes: "",
};