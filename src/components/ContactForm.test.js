import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm />)
});

test('renders the contact form header', ()=> {
    render(<ContactForm />)
    const header = screen.queryByText(/contact form/i);
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i)
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const fName = screen.queryByLabelText(/first name*/i);
    userEvent.type(fName, 'DEV');
    expect(fName).toHaveValue('DEV');
    const errMessages = await screen.queryAllByTestId(/error/i);
    expect(errMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const fName = screen.queryByLabelText(/first name*/i);
    const lName = screen.queryByLabelText(/last name*/i);
    const email = screen.queryByLabelText(/email*/i);
    const message = screen.queryByLabelText(/message/i);
    const submitBtn = screen.getByRole("button");
    expect(fName).toHaveValue('');
    expect(lName).toHaveValue('');
    expect(email).toHaveValue('');
    expect(message).toHaveValue('');

    userEvent.click(submitBtn);
    const errMessages = await screen.queryAllByTestId(/error/i);
    expect(errMessages).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const fName = screen.queryByLabelText(/first name*/i);
    const lName = screen.queryByLabelText(/last name*/i);
    const email = screen.queryByLabelText(/email*/i);
    const submitBtn = screen.getByRole("button");
    userEvent.type(fName, 'MICHAEL')
    userEvent.type(lName, 'MICHAELSON')
    expect(fName).toHaveValue('MICHAEL');
    expect(lName).toHaveValue('MICHAELSON');
    expect(email).toHaveValue('');

    userEvent.click(submitBtn);
    const errMessages = await screen.queryAllByTestId(/error/i);
    expect(errMessages).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);
    const fName = screen.queryByLabelText(/first name*/i);
    const lName = screen.queryByLabelText(/last name*/i);
    const email = screen.queryByLabelText(/email*/i);
    userEvent.type(fName, 'Valid')
    userEvent.type(lName, 'Valid')
    userEvent.type(email, 'INVALID');
    expect(fName).toHaveValue('Valid');
    expect(lName).toHaveValue('Valid');
    expect(email).toHaveValue('INVALID');

    const errMessages = await screen.findByText(/email must be a valid email address/i);
    expect(errMessages).toBeInTheDocument()
});

test('renders "lastName is a required field" if a last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);
    const lName = screen.queryByLabelText(/last name*/i);
    const submitBtn = screen.getByRole("button");
 
    expect(lName).toHaveValue('');
   
    userEvent.click(submitBtn);
    const errMessage = screen.queryByText(/lastName is a required field/i)
    expect(errMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);
    const fName = screen.queryByLabelText(/first name*/i);
    const lName = screen.queryByLabelText(/last name*/i);
    const email = screen.queryByLabelText(/email*/i);
    const message = screen.queryByLabelText(/message/i);
    const submitBtn = screen.getByRole("button");
    userEvent.type(fName, 'fValid')
    userEvent.type(lName, 'lValid')
    userEvent.type(email, 'VALID@Valid.com');
    expect(fName).toHaveValue('fValid');
    expect(lName).toHaveValue('lValid');
    expect(email).toHaveValue('VALID@Valid.com');
    expect(message).toHaveValue('');
    userEvent.click(submitBtn);

    const fNameDisplay = await screen.findByTestId(/firstnamedisplay/i)
    const lNameDisplay = await screen.findByTestId(/lastnamedisplay/i)
    const emailDisplay = await screen.findByTestId(/emaildisplay/i)
    const messageDisplay = screen.queryByTestId(/messagedisplay/i)
    expect(fNameDisplay).toHaveTextContent('fValid');
    expect(lNameDisplay).toHaveTextContent('lValid');
    expect(emailDisplay).toHaveTextContent('VALID@Valid.com')
    expect(messageDisplay).toBeFalsy();
    expect(messageDisplay).not.toBeInTheDocument();
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);
    const fName = screen.queryByLabelText(/first name*/i);
    const lName = screen.queryByLabelText(/last name*/i);
    const email = screen.queryByLabelText(/email*/i);
    const message = screen.queryByLabelText(/message/i);
    const submitBtn = screen.getByRole("button");
    userEvent.type(fName, 'fValid')
    userEvent.type(lName, 'lValid')
    userEvent.type(email, 'VALID@Valid.com');
    userEvent.type(message, 'this is a message ok???')
    expect(fName).toHaveValue('fValid');
    expect(lName).toHaveValue('lValid');
    expect(email).toHaveValue('VALID@Valid.com');
    expect(message).toHaveValue('this is a message ok???');
    userEvent.click(submitBtn);

    const fNameDisplay = await screen.findByTestId(/firstnamedisplay/i)
    const lNameDisplay = await screen.findByTestId(/lastnamedisplay/i)
    const emailDisplay = await screen.findByTestId(/emaildisplay/i)
    const messageDisplay = await screen.findByTestId(/messagedisplay/i)
    expect(fNameDisplay).toHaveTextContent('fValid');
    expect(lNameDisplay).toHaveTextContent('lValid');
    expect(emailDisplay).toHaveTextContent('VALID@Valid.com')
    expect(messageDisplay).toHaveTextContent('this is a message ok???');
});