export const renderWithLang = (contentObject, lang) => {
  switch (lang) {
    case 'English':
      return contentObject.value;
    case 'Dutch':
      return contentObject.nl;
    default:
      return contentObject.value;
  }
};
