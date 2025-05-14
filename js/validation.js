// Валидация ФИО
function validateFIO(fio, selector) {
    if (!fio) {
        setValidationState(selector, false, 'Пожалуйста, введите ФИО');
        return false;
    }
    
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/u;
    const parts = fio.split(' ').filter(part => part.length > 0);
    
    if (parts.length < 2) {
        setValidationState(selector, false, 'Введите полное ФИО (минимум 2 слова)');
        return false;
    }
    
    if (!nameRegex.test(fio)) {
        setValidationState(selector, false, 'ФИО не должно содержать цифр или специальных символов');
        return false;
    }
    
    if (fio.length > 100) {
        setValidationState(selector, false, 'ФИО должно содержать не более 100 символов');
        return false;
    }
    
    setValidationState(selector, true, '');
    return true;
}

// Валидация паспорта
function validatePassport(passport) {
    const selector = '#document-number';
    if (!passport) {
        setValidationState(selector, false, 'Пожалуйста, введите номер паспорта');
        return false;
    }
    
    const cleaned = passport.replace(/\s+/g, '').replace(/-+/g, '');
    const isValid = /^\d{10}$/.test(cleaned);
    
    if (!isValid) {
        setValidationState(selector, false, 'Введите 10 цифр номера паспорта (серия и номер)');
        return false;
    }
    
    setValidationState(selector, true, '');
    return true;
}

// Валидация email
function validateEmail(email) {
    const selector = '#email';
    
    if (email && email.trim() !== '') {
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = pattern.test(email);
        
        if (!isValid) {
            setValidationState(selector, false, 'Введите корректный email адрес');
            return false;
        }
    }
    
    setValidationState(selector, true, '');
    return true;
}
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Валидация даты рождения взрослого (18+ лет)
function validateBirth(birthdate) {
    const dateInSelector = '#birthdate';
    
    if (!birthdate) {
        setValidationState(dateInSelector, false, 'Укажите дату рождения');
        return false;
    }
    
    const age = calculateAge(birthdate);
    
    if (age < 18) {
        setValidationState(dateInSelector, false, 'Гость должен быть старше 18 лет');
        return false;
    }

    setValidationState(dateInSelector, true, '');
    return true;
}

// Валидация даты рождения ребенка (<18 лет)
function validateChildBirth(birthdate, index) {
    const dateInSelector = `#child-birthdate-${index}`;
    
    if (!birthdate) {
        setValidationState(dateInSelector, false, 'Укажите дату рождения ребенка');
        return false;
    }
    
    const age = calculateAge(birthdate);
    
    if (age >= 18) {
        setValidationState(dateInSelector, false, 'Ребенок должен быть младше 18 лет');
        return false;
    }

    setValidationState(dateInSelector, true, '');
    return true;
}
// Валидация дат
function validateDates(checkIn, checkOut) {
    const checkInSelector = '#check-in';
    const checkOutSelector = '#check-out';
    
    if (!checkIn) {
        setValidationState(checkInSelector, false, 'Укажите дату заезда');
        return false;
    }
    
    if (!checkOut) {
        setValidationState(checkOutSelector, false, 'Укажите дату выезда');
        return false;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    
    if (inDate < today) {
        setValidationState(checkInSelector, false, 'Дата заезда не может быть в прошлом');
        return false;
    }
    
    if (outDate <= inDate) {
        setValidationState(checkOutSelector, false, 'Дата выезда должна быть позже даты заезда');
        return false;
    }
    
    setValidationState(checkInSelector, true, '');
    setValidationState(checkOutSelector, true, '');
    return true;
}

// Валидация выпадающих списков
function validateSelect(selector, errorMessage) {
    const value = $(selector).val();
    
    if (!value) {
        setValidationState(selector, false, errorMessage);
        return false;
    }
    
    setValidationState(selector, true, '');
    return true;
}
function setValidationState(selector, isValid, errorMsg) {
        const $field = $(selector);
        const $feedback = $field.next('.invalid-feedback');
        
        if (isValid) {
            $field.removeClass('is-invalid').addClass('is-valid');
        } else {
            $field.removeClass('is-valid').addClass('is-invalid');
            $feedback.text(errorMsg);
        }
    }



// Функции для отображения сообщений
function showError(message) {
    const errorElement = document.getElementById('authError');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function showSuccess(message) {
    alert(message); 
}


    // Функции валидации
    function validateName(value,errorMsg) {
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/u;
    
    let isValid = value.length > 0;
    let errorMessage = errorMsg;
    if (isValid) {
        if (!nameRegex.test(value)) {
            isValid = false;
            errorMessage = 'Имя не должно содержать цифр или специальных символов';
        } else if (value.length < 2) {
            isValid = false;
            errorMessage = 'Имя должно содержать не менее 2 символов';
        } else if (value.length > 50) {
            isValid = false;
            errorMessage = 'Имя должно содержать не более 50 символов';
        }
    }
    setValidationState('#regFirstName', isValid, errorMessage);
    return isValid;
}

function validateLast(value,errorMsg) {
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/u;
    let errorMessage = errorMsg;
    let isValid = value.length > 0;
    
    if (isValid) {
        if (!nameRegex.test(value)) {
            isValid = false;
            errorMessage = 'Фамилия не должна содержать цифр или специальных символов';
        } else if (value.length < 2) {
            isValid = false;
            errorMessage = 'Фамилия должна содержать не менее 2 символов';
        } else if (value.length > 50) {
            isValid = false;
            errorMessage = 'Фамилия должна содержать не более 50 символов';
        }
    }
    setValidationState('#regLastName', isValid, errorMessage);
    return isValid;
}

function validateOtch(value,errorMsg) {
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/u;
    let errorMessage = errorMsg;
    let isValid = value.length > 0;
    
    if (isValid) {
        if (!nameRegex.test(value)) {
            isValid = false;
            errorMessage = 'Отчество не должно содержать цифр или специальных символов';
        } else if (value.length < 2) {
            isValid = false;
            errorMessage = 'Отчество должно содержать не менее 2 символов';
        } else if (value.length > 50) {
            isValid = false;
            errorMessage = 'Отчество должно содержать не более 50 символов';
        }
    }
    setValidationState( '#regOtch', isValid, errorMessage);
    return isValid;
}


    function validatePhone(phone,selector) {
        const regex = /^\+?\d{11}$/;
        const isValid = regex.test(phone);
        setValidationState(selector, isValid, 'Введите корректный телефон (формат: +71234567890)');
        return isValid;
    }
    
    function validateLogin(login) {
        const regex = /^[a-zA-Z0-9]{5,15}$/;
        const isValid = regex.test(login);
        setValidationState('#regLogin', isValid, 'Логин должен быть от 5 до 15 символов (только буквы и цифры)');
        return isValid;
    }
    
    function validatePassword(password) {
        const hasMinLength = password.length >= 8;
        const hasMaxLength = password.length <= 15;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        const isValid = hasMinLength && hasMaxLength && hasUpper && hasLower && hasNumber;
        setValidationState('#regPassword', isValid, 'Пароль должен содержать от 8 до 15 символов, включая цифры и буквы разного регистра');
        return isValid;
    }

 
