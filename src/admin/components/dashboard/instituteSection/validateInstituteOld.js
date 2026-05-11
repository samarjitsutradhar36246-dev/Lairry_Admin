// src/utils/validateInstitute.js

export const validateInstitute = (institute) => {
  const errors = {};

  // Regex patterns
  const stringRegex = /^[A-Za-z\s]+$/; // only letters & spaces
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const numberRegex = /^\d+$/;
  const phoneRegex = /^\d{10}$/;

  // Institute Name (string)
  if (!institute.institute_name.trim()) {
    errors.institute_name = "Institute name is required";
  } else if (!stringRegex.test(institute.institute_name)) {
    errors.institute_name = "Institute name must contain only letters";
  }

  // Institute Email
  if (!institute.institute_email.trim()) {
    errors.institute_email = "Institute email is required";
  } else if (!emailRegex.test(institute.institute_email)) {
    errors.institute_email = "Invalid email format";
  }

  // Contact Person Name (string)
  if (!institute.contact_person_name.trim()) {
    errors.contact_person_name = "Contact person name is required";
  } else if (!stringRegex.test(institute.contact_person_name)) {
    errors.contact_person_name = "Name must contain only letters";
  }

  // Contact Person Designation (string)
  if (!institute.contact_person_designation.trim()) {
    errors.contact_person_designation = "Designation is required";
  } else if (!stringRegex.test(institute.contact_person_designation)) {
    errors.contact_person_designation = "Designation must contain only letters";
  }

  // Contact Phone (number)
  if (!institute.contact_phone.trim()) {
    errors.contact_phone = "Contact phone is required";
  } else if (!phoneRegex.test(institute.contact_phone)) {
    errors.contact_phone = "Phone number must be 10 digits";
  }

  // Institute Type (string)
  if (!institute.institute_type.trim()) {
    errors.institute_type = "Institute type is required";
  } else if (!stringRegex.test(institute.institute_type)) {
    errors.institute_type = "Institute type must contain only letters";
  }

  // City (string)
  if (!institute.location_city.trim()) {
    errors.location_city = "City is required";
  } else if (!stringRegex.test(institute.location_city)) {
    errors.location_city = "City must contain only letters";
  }

  // State (string)
  if (!institute.location_state.trim()) {
    errors.location_state = "State is required";
  } else if (!stringRegex.test(institute.location_state)) {
    errors.location_state = "State must contain only letters";
  }

  // Country (string)
  if (!institute.location_country.trim()) {
    errors.location_country = "Country is required";
  } else if (!stringRegex.test(institute.location_country)) {
    errors.location_country = "Country must contain only letters";
  }

  // Pin (number)
  if (!institute.location_pin.trim()) {
    errors.location_pin = "Pin is required";
  } else if (!numberRegex.test(institute.location_pin)) {
    errors.location_pin = "Pin must contain only numbers";
  }

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
  location_country: "",
  location_pin: "",
  latitude: "",
  longitude: "",
  admin_notes: "",
};