import { Component } from 'react';
import { nanoid } from 'nanoid';
import Swal from 'sweetalert2';
import ContactForm from 'components/ContactForm';
import Filter from 'components/Filter';
import ContactList from 'components/ContactList';
import ContactsSection from 'components/Section';
import { Section, Title } from './Phonebook.styled';

export default class Phonebook extends Component {
  state = {
    contacts: [
      { id: nanoid(), name: 'Rosie Simpson', number: '459-12-56' },
      { id: nanoid(), name: 'Hermione Kline', number: '443-89-12' },
      { id: nanoid(), name: 'Eden Clements', number: '645-17-79' },
      { id: nanoid(), name: 'Annie Copeland', number: '227-91-26' },
      { id: nanoid(), name: 'Diana Colean', number: '456-12-78' },
      { id: nanoid(), name: 'Margarett Kinn', number: '467-89-89' },
      { id: nanoid(), name: 'Nick Cherchel', number: '678-17-90' },
      { id: nanoid(), name: 'Anna Nonear', number: '234-91-56' },
    ],
    filter: '',
  };

  handleSubmit = e => {
    e.preventDefault();
    const name = e.target.name.value;
    const number = e.target.number.value;
    const contactsNames = this.state.contacts.find(
      contact => contact.name === name
    );
    const contactsNumbers = this.state.contacts.find(
      contact => contact.number === number
    );
    const contact = { id: nanoid(), name, number };

    if (contactsNames) {
      Swal.fire({
        title: 'Error!',
        text: `Sorry, ${name} is already in your contacts`,
        icon: 'error',
        confirmButtonText: 'Got it',
      });
      return;
    }
    if (contactsNumbers) {
      Swal.fire({
        title: 'Error!',
        text: `Sorry, ${number} is already in your contacts`,
        icon: 'error',
        confirmButtonText: 'Got it',
      });
      return;
    }
    this.setState(prevState => ({
      contacts: [contact, ...prevState.contacts],
    }));
    e.target.reset();
  };

  handleDeleteClick = id => {
    const filtered = this.state.contacts.filter(contact => contact.id !== id);
    this.setState({ contacts: filtered });
  };

  handleChangeFilter = e => {
    this.setState({ filter: e.target.value });
  };

  createFilter = () => {
    const { state } = this;
    const normalizedFilterValue = state.filter.toLocaleLowerCase();
    const filteredContacts = state.contacts.filter(
      contact =>
        contact.name.toLocaleLowerCase().includes(normalizedFilterValue) ||
        contact.number.toString().includes(normalizedFilterValue)
    );
    return filteredContacts;
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(_, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }
  render() {
    const {
      state,
      handleSubmit,
      handleChangeFilter,
      handleDeleteClick,
      createFilter,
    } = this;
    const filteredContacts = createFilter();
    return (
      <Section>
        <div>
          <Title>Phonebook</Title>
          <ContactForm onSubmit={handleSubmit} />
        </div>
        <ContactsSection title="Contacts">
          <Filter
            handleChangeFilter={handleChangeFilter}
            filter={state.filter}
          />
          <ContactList
            filter={filteredContacts}
            handleClick={handleDeleteClick}
          />
        </ContactsSection>
      </Section>
    );
  }
}
