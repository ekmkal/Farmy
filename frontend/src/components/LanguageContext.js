/* eslint-disable no-unreachable */
import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import English from '../languages/en.json';
import Dutch from '../languages/nl.json';

export const Context = React.createContext();

const LanguageContext = (props) => {
  const [lang, setLang] = useState('English');
  const [messages, setMessages] = useState(English);

  const setLanguage = (e) => {
    if (e.target.value === 'Dutch') {
      setLang('Dutch');
      setMessages(Dutch);
    } else {
      setLang('English');
      setMessages(English);
    }
  };

  return (
    <Context.Provider value={{ lang, setLanguage }}>
      <IntlProvider messages={messages} locale="en">
        {props.children}
      </IntlProvider>
    </Context.Provider>
  );
};

export default LanguageContext;
