export const validateContact = (data) => {
  const errors = {};

  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.trim().length > 50) {
    errors.firstName = 'First name must be under 50 characters';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.trim().length > 50) {
    errors.lastName = 'Last name must be under 50 characters';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^[\d\s\-\+\(\)]{7,15}$/.test(data.phone)) {
    errors.phone = 'Please enter a valid phone number (7–15 digits)';
  }

  if (!data.company?.trim()) {
    errors.company = 'Company name is required';
  } else if (data.company.trim().length > 100) {
    errors.company = 'Company name must be under 100 characters';
  }

  return errors;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getInitials = (firstName, lastName) => {
  return `${(firstName?.[0] || '').toUpperCase()}${(lastName?.[0] || '').toUpperCase()}`;
};

export const avatarColors = [
  { bg: '#E6F1FB', text: '#0C447C' },
  { bg: '#E1F5EE', text: '#085041' },
  { bg: '#FAEEDA', text: '#633806' },
  { bg: '#FBEAF0', text: '#72243E' },
  { bg: '#EEEDFE', text: '#3C3489' },
  { bg: '#EAF3DE', text: '#27500A' },
  { bg: '#FAECE7', text: '#712B13' },
];

export const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};
