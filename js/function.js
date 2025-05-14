jQuery(function ($) {
    $(".sidebar-dropdown > a").click(function() {
      $(".sidebar-submenu").slideUp(200);
      if ($(this).parent().hasClass("active")) {
        $(".sidebar-dropdown").removeClass("active");
        $(this).parent().removeClass("active");
      } else {
        $(".sidebar-dropdown").removeClass("active");
        $(this).next(".sidebar-submenu").slideDown(200);
        $(this).parent().addClass("active");
      }
    });
    $(".btn-booking").click(function() {
          $(".card-booking").toggleClass("noactive active");
          $(this).find('i').toggleClass('fa-plus fa-times');
          $(this).toggleClass('btn-primary');
      });
      
    $("#menu-booking").click(function() { 
      $(".page-content section").removeClass("active");
      $(".booking").addClass("active");
    });
    
    $("#menu-client").click(function() { 
      $(".page-content section").removeClass("active");
      $(".clients").addClass("active");
    });
  
    $("#menu-rooms").click(function() { 
      $(".page-content section").removeClass("active");
      $(".rooms").addClass("active");
    });
    
    $("#menu-services").click(function() { 
      $(".page-content section").removeClass("active");
      $(".services").addClass("active");
    });
  
    $("#menu-analytic").click(function() { 
      $(".page-content section").removeClass("active");
      $(".analytic").addClass("active");
    });
    
    $("#close-sidebar").click(function() {
      $(".page-wrapper").removeClass("toggled");
    });
  
    $("#show-sidebar").click(function() {
      $(".page-wrapper").addClass("toggled");
    });
  });
  
  $(document).ready(function() {
       // Проверяем аутентификацию при загрузке страницы
        checkAuth();
     
      $('#login-tab').click(function(e) {
          e.preventDefault();
          $(this).addClass('active');
          $('#register-tab').removeClass('active');
          $('#loginForm').addClass('active');
          $('#registerForm').removeClass('active');
      });
      
      $('#register-tab').click(function(e) {
          e.preventDefault();
          $(this).addClass('active');
          $('#login-tab').removeClass('active');
          $('#registerForm').addClass('active');
          $('#loginForm').removeClass('active');
      });
      
     
      $('#booking-tab').click(function(e) {
        e.preventDefault();
        // Управление кнопками
        $(this).addClass('active').attr('aria-selected', 'true');
        $('#departures-tab, #current-tab').removeClass('active').attr('aria-selected', 'false');
        
        // Управление содержимым
        $('#booking').addClass('show active');
        $('#departures, #current').removeClass('show active');
    });

    $('#current-tab').click(function(e) {
        e.preventDefault();
        // Управление кнопками
        $(this).addClass('active').attr('aria-selected', 'true');
        $('#departures-tab, #booking-tab').removeClass('active').attr('aria-selected', 'false');
        
        // Управление содержимым
        $('#current').addClass('show active');
        $('#departures, #booking').removeClass('show active');
    });

    $('#departures-tab').click(function(e) {
        e.preventDefault();
        // Управление кнопками
        $(this).addClass('active').attr('aria-selected', 'true');
        $('#booking-tab, #current-tab').removeClass('active').attr('aria-selected', 'false');
        
        // Управление содержимым
        $('#departures').addClass('show active');
        $('#booking, #current').removeClass('show active');
    });

    $('#calendar').click(function(e) {
        e.preventDefault();
        // Управление кнопками
        $(this).addClass('active').attr('aria-selected', 'true');
        $('#list').removeClass('active').attr('aria-selected', 'false');
        
        // Управление содержимым
        $('#rooms-calendar').addClass('show active');
        $('#rooms-list').removeClass('show active');
    });

    $('#list').click(function(e) {
        e.preventDefault();
        // Управление кнопками
        $(this).addClass('active').attr('aria-selected', 'true');
        $('#calendar').removeClass('active').attr('aria-selected', 'false');
        
        // Управление содержимым
        $('#rooms-list').addClass('show active');
        $('#room_calendar').removeClass('show active');
    });

      $('#registerForm').submit(function(e) {
          e.preventDefault();
          const formData = {
              lastname: $('#regLastName').val().trim(),
              name: $('#regFirstName').val().trim(),
              otch: $('#regOtch').val().trim(),
              number: $('#regPhone').val().trim(),
              login: $('#regLogin').val().trim(),
              pass: $('#regPassword').val()
          };
  
  
          const isFirstNameValid = validateName(formData.lastname, 'Имя');
          const isLastNameValid = validateLast(formData.name, 'Фамилия');
          const isOtchValid = validateOtch(formData.otch, 'Отчество');
          const isPhoneValid = validatePhone(formData.number,'#regPhone');
          const isLoginValid = validateLogin(formData.login);
          const isPasswordValid = validatePassword(formData.pass);
  
          if (isFirstNameValid && isLastNameValid && isPhoneValid && 
              isLoginValid && isPasswordValid) {
              registerAdmin(formData);
          }
      });
      
      $('#loginForm').submit(function(e) {
          e.preventDefault();
  
          const formData = {
              login: $('#loginUsername').val().trim(),
              pass: $('#loginPassword').val()
          };
  
          const isLoginValid = validateLogin(formData.login);
          const isPasswordValid = validatePassword(formData.pass);
  
          if (isLoginValid && isPasswordValid) {
              LoginAdmin(formData);
          }
      });
  
      function checkRole() {
        fetch('php/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.role === 'manager') {
                // Показываем кнопку регистрации
                $('#registerBtn').show();
            }
        });
    }
    checkRole();

  
// Обработка формы входа управляющего
$('#managerLoginForm').submit(function(e) {
  e.preventDefault();
  
  const login = $('#managerUsername').val().trim();
  const password = $('#managerPassword').val();
  
  // Проверка валидации
  if (!login || !password) {
    showManagerError('Заполните все поля');
    return;
  }
  
  // Отправка данных на сервер
  fetch('php/login_manager.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      login: login,
      pass: password
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Сохраняем данные в localStorage
      localStorage.setItem('isManagerAuthenticated', 'true');
      localStorage.setItem('managerData', JSON.stringify({
        name: data.name,
        login: login
      }));
      
      // Закрываем модальное окно
      $('#managerLoginModal').modal('hide');
      
      // Показываем интерфейс управляющего
      initManagerInterface();
    } else {
      showManagerError(data.message || 'Ошибка входа');
    }
  })
  .catch(error => {
    showManagerError('Ошибка соединения с сервером');
  });
});

function showManagerError(message) {
  const $error = $('#managerLoginError');
  $error.text(message).show();
  setTimeout(() => $error.hide(), 5000);
}
// Запрос к серверу для получения роли
function checkAdminRole() {
    fetch('php/get_role.php')
        .then(response => response.json())
        .then(data => {
            console.log('Текущая роль:', data.role);
            alert('Ваша роль: ' + (data.role || 'не определена'));
        });
}
checkAdminRole();
// localStorage.removeItem('isManagerAuthenticated');
// location.reload();
checkManagerStatus();
$('#openManagerLogin').click(function() {
    $('#managerLoginModal').modal('show');
});

function checkManagerStatus() {
    fetch('php/check_manager_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.isManager) {
                $('#managerLogoutBtn').show();
            }
        });
}
$('#managerLogoutBtn').click(function() {
    fetch('php/logout_manager.php', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Скрываем кнопку выхода
            $('#managerLogoutBtn').hide();

            // Очищаем поля входа
            $('#loginUsername').val('');
            $('#loginPassword').val('');

            // Удаляем данные из localStorage
            localStorage.removeItem('isManagerAuthenticated');
            localStorage.removeItem('managerData');

            // Показываем модальное окно входа управляющего
            $('#managerLoginModal').modal('show');

            showSuccess('Вы успешно вышли из системы управляющего');
        }
    });
});

function initManagerInterface() {
  // Показываем специальные элементы для управляющего
  $('#registerAdminBtn').show();
  $('.manager-only').show();
  
  // Обновляем приветствие
  const managerData = JSON.parse(localStorage.getItem('managerData'));
  $('.user-name').html('<strong>' + managerData.name + '</strong>');
  $('.user-role').text('meneger');
}

      function LoginAdmin(formData) {
        const data = new FormData();
        for (let key in formData) {
            data.append(key, formData[key]);
        }
    
        fetch('php/login_admin.php', {
            method: 'POST',
            body: data,
            credentials: 'include' // Важно для работы с куками
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const adminData = {
                    id: result.admin_id,
                    login: formData.login,
                    name: result.name,
                    lastname: result.lastname
                };
                
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('adminData', JSON.stringify(adminData));
                
                // Обновляем интерфейс
                $('#loginOverlay').hide();
                $('.page-wrapper').show();
                $('#authError').hide();
                if (result.name && result.lastname) {
                    $('.sidebar-wrapper .user-info .user-name').html('<strong>' + result.lastname + ' ' + result.name + '</strong>');
                
                }
                fetchEmployees();
            } else {
                showError('authError', result.message || 'Ошибка входа');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            showError('authError', 'Ошибка соединения с сервером');
        });
    }
    // Пример запроса к API
function fetchEmployees() {
    fetch('php/employees.php', {
        credentials: 'include' // Отправляем куки с запросом
    })
    .then(response => {
        if (!response.ok) throw new Error('Ошибка сети');
        return response.json();
    })
    .then(data => {
        console.log(data.message);
        // Обработка данных
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}
    function checkAuth() {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const adminData = localStorage.getItem('adminData');
        
        if (isAuthenticated && adminData) {
            try {
                const admin = JSON.parse(adminData);
                $('#loginOverlay').hide();
                $('.page-wrapper').show();
                
                // Обновляем интерфейс с данными пользователя
                if (admin.name && admin.lastname) {
                    $('.sidebar-wrapper .user-info .user-name').html('<strong>' + admin.lastname + ' ' + admin.name + '</strong>');
                }
            } catch (e) {
                console.error('Ошибка при чтении данных администратора:', e);
                logout();
            }
        } else {
            $('#loginOverlay').show();
            $('.page-wrapper').hide();
        }
    }

    function registerAdmin(formData) {
        const data = new FormData();
    for (let key in formData) {
        data.append(key, formData[key]);
    }
        fetch('php/registration_admin.php', {
    method: 'POST',

    body: data
    })
    .then(response => {
    console.log('Response:', response);
    
    return response.text().then(text => {
        if (!text) {
            throw new Error('Пустой ответ от сервера');
        }
        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error('Ошибка при парсинге JSON: ' + e.message);
        }
    });
})
.then(result => {
    console.log('Парсирование результата:', result); 
    if (result.success && result.name && result.lastname) {
        showError('Регистрация прошла успешно!');

    } else {
            showError(result.message || 'Ошибка регистрации');
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        showError('Ошибка соединения с сервером');
    });
}


$('#logout-btn').click(function(e) {
        e.preventDefault();
        logoutAdmin();
    });

    // Функция выхода
    function logoutAdmin() {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('adminData');
        const formData = new FormData();
    formData.append('action', 'logout');

    fetch('php/logout_admin.php', {
        method: 'POST',
        body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
              
                // Показываем форму авторизации
                $('#loginOverlay').show();
                $('.page-wrapper').hide();
                
                // Очищаем форму
                $('#loginForm')[0].reset();
                
                // Обновляем интерфейс
                $('.user-name').text('Фамилия Имя');
                $('.user-role').text('Администратор');
            } else {
                showError(data.message || 'Ошибка при выходе');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            showError('Ошибка соединения с сервером');
        });
    }


      $('#booking-form').submit(function(e) {
      e.preventDefault();
      console.log('--- ФОРМА: Начата обработка отправки ---');
      const formData = {
          FIO: $('#guest-name').val().trim(),
          phone: $('#phone').val().trim(),
          email: $('#email').val().trim(),
          pasport: $('#document-number').val().trim(),
          birthdate: $('#birthdate').val().trim(),
          dateinput: $('#check-in').val(),
          dateoutput: $('#check-out').val(),
          adults: $('#adults_count').val(),
          children: $('#children-count').val(),
          services: $('input[name="services"]:checked').map(function() {
              return {
              id_services: $(this).attr('id'),
              value: $(this).val().trim()
          };
      }).get(),
          childrenData: $('.child-fields').map(function(index) {
          const childIndex = index + 1;
          return {
              lastname_child: $(`#child-lastname-${childIndex}`).val().trim(),
              firstname_child: $(`#child-firstname-${childIndex}`).val().trim(),
              otch_child: $(`#child-otch-${childIndex}`).val().trim(),
              birthdate_child: $(`#child-birthdate-${childIndex}`).val().trim()
          };
      }).get(),
          discount: $('#discount-type').val(),
          paymentOption : $('#payment-option').val(),
          roomId: selectedRoom.roomId,
          roomPrice: selectedRoom.roomPrice
      };
  
      console.log('Основные данные формы:', JSON.parse(JSON.stringify(formData)));
      console.log('Данные детей:', formData.childrenData);
      console.log('Выбранные услуги:', formData.services);
      // Валидация
      console.log('--- ВАЛИДАЦИЯ ---');
      const isFIOValid = validateFIO(formData.FIO, '#guest-name');
      const isPhoneValid = validatePhone(formData.phone,'#phone');
      const isPassportValid = validatePassport(formData.pasport);
      const isDatesValid = validateDates(formData.dateinput, formData.dateoutput);
      const isEmailValid = validateEmail(formData.email);
      const isBirthValid = validateBirth(formData.birthdate);
      const isPlaceValid = validateSelect('#adults_count', 'Выберите кол-во взрослых');
      let isChildrenDataValid = true;
      formData.childrenData.forEach((child, index) => {
          const childIndex = index + 1;
          if (!validateChildBirth(child.birthdate_child, childIndex)) {
              isChildrenDataValid = false;
          }
      });
  
      console.log('Результаты валидации:', {
          FIO: isFIOValid,
          phone: isPhoneValid,
          pasport: isPassportValid,
          dates: isDatesValid,
          email: isEmailValid,
          birthdate: isBirthValid,
          adults: isPlaceValid,
          children: isChildrenDataValid
      });
  
      if (isFIOValid && isPhoneValid && isEmailValid && isBirthValid &&
          isPassportValid && isDatesValid && isPlaceValid && isChildrenDataValid) {
          console.log('--- ВАЛИДАЦИЯ ПРОЙДЕНА ---');
          submitBooking(formData);
      } else {
          console.warn('--- ВАЛИДАЦИЯ НЕ ПРОЙДЕНА ---');
      }
  });
  
  function submitBooking(formData) {
      console.log('--- ПОДГОТОВКА ОТПРАВКИ ---');
  
      const data = new FormData();
      for (let key in formData) {
          if (typeof formData[key] === 'object' && formData[key] !== null) {
              if (Array.isArray(formData[key])) {
                  formData[key].forEach((item, index) => {
                      if (typeof item === 'object') {
                          for (let subKey in item) {
                              data.append(`${key}[${index}][${subKey}]`, item[subKey]);
                          }
                      } else {
                          data.append(`${key}[]`, item);
                      }
                  });
              } else {
                  for (let subKey in formData[key]) {
                      data.append(`${key}[${subKey}]`, formData[key][subKey]);
                  }
              }
          } else {
              data.append(key, formData[key]);
          }
      }
      console.log('Создан новый FormData');
      
      console.log('--- ПОЛНЫЙ СОСТАВ FORMDATA ---');
      for (let [key, value] of data.entries()) {
          console.log(key, '=', value);
      }
  
      console.log('--- ОТПРАВКА НА СЕРВЕР ---');
  
      fetch('php/booking.php', {
      method: 'POST',
      body: data
      })
      .then(response => {
      console.log('Response:', response);
      return response.text().then(text => {
          if (!text) {
              throw new Error('Пустой ответ от сервера');
          }
          try {
              // Преобразуем в JSON
              return JSON.parse(text);
          } catch (e) {
              throw new Error('Ошибка при парсинге JSON: ' + e.message);
          }
      });
  })
  .then(result => {
      console.log('Парсирование результата:', result); 
      if (result.success) {
                  showSuccess('Бронирование успешно завершено!');
                  $('#total-price-room').text(result.total_with_discount.toLocaleString('ru-RU') + ' ₽');
                  $('#total-price-services').text(result.total_services_price.toLocaleString('ru-RU') + ' ₽');
              }  else {
              showError(result.message || 'Ошибка бронирования');
          }
      })
      .catch(error => {
          console.error('Ошибка:', error);
          showError('Ошибка соединения с сервером');
      });
  }
  
  $('#children-count').change(function() {
      const count = parseInt($(this).val());
      const container = $('#children-fields-container');
      container.empty();
      
      for (let i = 1; i <= count; i++) {
          container.append(`
              <div class="child-fields mb-3 border p-3">
                  <h6>Ребенок ${i}</h6>
                  <div class="row">
                      <div class="col-md-4">
                          <div class="form-group mb-3">
                              <label for="child-lastname-${i}" class="form-label">Фамилия</label>
                              <input type="text" name="children[${i}][lastname]" class="form-control child-lastname" id="child-lastname-${i}">
                          </div>
                      </div>
                      <div class="col-md-4">
                          <div class="form-group mb-3">
                              <label for="child-firstname-${i}" class="form-label">Имя</label>
                              <input type="text" name="children[${i}][firstname]" class="form-control child-firstname" id="child-firstname-${i}">
                          </div>
                      </div>
                        <div class="col-md-4">
                          <div class="form-group mb-3">
                              <label for="child-otch-${i}" class="form-label">Отчество</label>
                              <input type="text" name="children[${i}][otch]" class="form-control child-otch" id="child-otch-${i}">
                          </div>
                      </div>
                      <div class="col-md-4">
                          <div class="form-group mb-3">
                              <label for="child-birthdate-${i}" class="form-label">Дата рождения</label>
                              <input type="date" name="children[${i}][birthdate]" class="form-control child-birthdate" id="child-birthdate-${i}">
                          </div>
                      </div>
                  </div>
              </div>
          `);
      }
  });
  
  $('#find-rooms-btn').click(function(e) {
      e.preventDefault();
      findAvailableRooms();
  });
  let selectedRoom = null; 
  function findAvailableRooms() {
      const formData = {
          dateinput: $('#check-in').val(),
          dateoutput: $('#check-out').val(),
          adults: $('#adults_count').val(),
          children: $('#children-count').val()
      };
      
      if (!validateDates(formData.dateinput, formData.dateoutput)) {
          return;
      }
          const data= new FormData();
          for (let key in formData){
              data.append(key,formData[key])
          }
  
      fetch('php/booking_process.php', {
          method: 'POST',
          body: data})
          .then(response => {
            return response.json();
        })
          .then(data=> {
              if (data.success && data.rooms) {
                  displayAvailableRooms(data.rooms);
              } 
              else {
              $('#available-rooms').html(`
                  <div class="col-12">
                      <div class="alert alert-danger">${data.message || 'Нет доступных номеров'}</div>
                  </div>
              `);
          }
          })
          .catch(error => {
          console.error('Error:', error);
          $('#available-rooms').html(`
              <div class="col-12">
                  <div class="alert alert-danger">Ошибка при поиске номеров</div>
              </div>
          `);
      })
  }
  
  // Функция для отображения найденных номеров
  function displayAvailableRooms(rooms) {
      const container = $('#available-rooms');
      container.empty();
  
      if (rooms.length === 0) {
          container.html(`
              <div class="col-12">
                  <div class="alert alert-warning">Нет доступных номеров для указанных параметров</div>
              </div>
          `);
          return;
      }
  
      rooms.forEach(room => {
          container.append(`
              <div class="col-md-4 mb-3">
                  <div class="card h-100">
                      <div class="card-body">
                          <h5 class="card-title">Номер ${room.room_id}</h5>
                          <p class="card-text">
                              <strong>Категория:</strong> ${room.category_name}<br>
                              <strong>Вместимость:</strong> ${room.capacity} чел.<br>
                              <strong>Цена за ночь:</strong> ${room.price_per_night} ₽
                          </p>
                          <button type="button" class="btn btn-primary select-room" 
                                  data-room-id="${room.room_id}"
                                  data-room-price="${room.price_per_night}">
                              Выбрать номер
                          </button>
                      </div>
                  </div>
              </div>
          `);
      });
  
      $('.select-room').click(function() {
          selectedRoom = {
              roomId: $(this).data('room-id'),
              roomPrice: $(this).data('room-price')
          };
          
          $('.select-room').removeClass('btn-success').addClass('btn-primary').text('Выбрать номер');
          $(this).removeClass('btn-primary').addClass('btn-success').text('Выбран');
          
          console.log('Выбран номер:', selectedRoom);
      });
  }


    fetch('php/update.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {

            $('#count-rooms').text(data.count_rooms);
            $('#checkinToday').text(data.checkinsToday);
            $('#checkoutToday').text(data.checkoutsToday);
            $('#busy').text(data.occupiedRooms + '%');

            let checkinText = '';
            if (data.checkinsToday > 0) {
                checkinText = `-${data.checkinsToday} за сегодня`;
            } else {
                checkinText = 'Нет новых заселений';
            }
            $('#count-rooms').next('p').html(`<small>${checkinText}</small>`);

            let occupancyStatus = '';
            let occupancyClass = '';
            if (data.occupancyRate > 70) {
                occupancyStatus = 'Высокая нагрузка';
                occupancyClass = 'text-danger';
            } else if (data.occupancyRate >= 20) {
                occupancyStatus = 'Нормальная нагрузка';
                occupancyClass = 'text-success';
            } else {
                occupancyStatus = 'Низкая нагрузка';
                occupancyClass = 'text-primary';
            }

            let busyCardBody = $('#busy').parent();
            busyCardBody.find('p').html(`<small>${occupancyStatus}</small>`);
            busyCardBody.find('p').removeClass('text-danger text-success text-primary').addClass(occupancyClass);
        } else {
            showError(data.message || 'Ошибка при выходе');
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        showError('Ошибка соединения с сервером');
    });

    loadBookings();
   
    // Загрузка данных
    function loadBookings(){ let allBookings = [];
    fetch(`php/booking-tab.php?status=all&timestamp=${Date.now()}`)

        .then(response => response.json())
        .then(data => {
            allBookings = data;
            renderBookings(allBookings); 
            setupFilterButtons(allBookings); 
            setupSortControls(allBookings);
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
            document.getElementById('bookings-table-body').innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger">Ошибка загрузки данных</td>
                </tr>
            `;
        });
    }

    function setupSortControls(allBookings) {
        const sortBtn = document.getElementById('sort-btn');
        const dateFromInput = document.getElementById('date-from');
        const dateToInput = document.getElementById('date-to');
        
        sortBtn.addEventListener('click', () => {
            const fromDate = dateFromInput.value ? new Date(dateFromInput.value + 'T00:00:00') : null;
            const toDate = dateToInput.value ? new Date(dateToInput.value + 'T23:59:59') : null;
            
            let filteredBookings = [...allBookings];
            
            // Фильтрация по дате заезда
            if (fromDate || toDate) {
                filteredBookings = filteredBookings.filter(booking => {
                    // Преобразуем дату из формата "YYYY-MM-DD" или "DD.MM.YYYY" в объект Date
                    let checkInDateStr = booking.check_in_date;
                    
                    // Если дата в формате DD.MM.YYYY, преобразуем в YYYY-MM-DD
                    if (checkInDateStr.includes('.')) {
                        const parts = checkInDateStr.split('.');
                        checkInDateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    }
                    
                    const checkInDate = new Date(checkInDateStr + 'T00:00:00');
                    
                    return (!fromDate || checkInDate >= fromDate) && 
                           (!toDate || checkInDate <= toDate);
                });
            }
            
            // Сортировка по дате заезда
            filteredBookings.sort((a, b) => {
                let dateAStr = a.check_in_date;
                let dateBStr = b.check_in_date;
                
                // Преобразование формата даты, если нужно
                if (dateAStr.includes('.')) {
                    const parts = dateAStr.split('.');
                    dateAStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                if (dateBStr.includes('.')) {
                    const parts = dateBStr.split('.');
                    dateBStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                
                return new Date(dateAStr) - new Date(dateBStr);
            });
            
            renderBookings(filteredBookings);
        });
    }
    // Функция для отображения бронирований
    function renderBookings(bookings) {
        const tbody = document.getElementById('bookings-table-body');
        tbody.innerHTML = '';
        
        if (!bookings || bookings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">Нет данных о бронированиях</td>
                </tr>
            `;
            return;
        }
        
        bookings.forEach(booking => {
            let badgeClass = 'badge-secondary';
            if (booking.status === 'подтверждено') badgeClass = 'badge-success';
            else if (booking.status === 'отменено') badgeClass = 'badge-danger';
            else if (booking.status === 'ожидание') badgeClass = 'badge-warning';
            
            tbody.innerHTML += `
                <tr>
                    <td>#${booking.booking_id}</td>
                    <td>${booking.guest_name}</td>
                    <td>${booking.room_number}</td>
                    <td>${booking.check_in_date}</td>
                    <td>${booking.check_out_date}</td>
                    <td><span class="badge ${badgeClass}">${booking.booking_status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${booking.booking_id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${booking.booking_id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    
        addEditDeleteHandlers();
    }

    // Настройка кнопок фильтрации
    function setupFilterButtons(allBookings) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const status = this.getAttribute('data-status');
                const filteredBookings = status === 'all' 
                    ? allBookings 
                    : allBookings.filter(booking => booking.booking_status === status);
            
                renderBookings(filteredBookings);
            });
        });
    }
    
    // Добавление обработчиков для кнопок редактирования/удаления
    function addEditDeleteHandlers() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                editBooking(this.getAttribute('data-id'));
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteBooking(this.getAttribute('data-id'));
            });
        });
    }


     // Функция удаления бронирования
    function deleteBooking(id) {
        if (!confirm('Вы уверены, что хотите удалить это бронирование?')) return;

        fetch(`php/delete_booking.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Бронирование успешно удалено!');

            } else {
                alert('Ошибка: ' + (data.error || 'Не удалось удалить бронирование'));
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    }

 // Функция редактирования бронирования
 function editBooking(id) {
    // Загружаем данные бронирования для редактирования
    fetch(`php/get_booking.php?id=${id}`)
    .then(response => {
        return response.json();
    })
    .then(booking => {
        console.log('Полученные данные бронирования:', booking);
        
        if (!booking || !booking.код_брони) {
            throw new Error('Данные бронирования не получены или не содержат ID');
        }

        // Создаем модальное окно для редактирования
        const modalHtml = `
            <div class="modal fade" id="editBookingModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Редактирование бронирования #${booking.код_брони}</h5>
                        <div class="modal-body">
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Дата заезда</label>
                                        <input type="date" class="form-control" id="editCheckIn" 
                                            value="${booking.дата_начала_бронирования}" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label class="form-label">Дата выезда</label>
                                        <input type="date" class="form-control" id="editCheckOut" 
                                            value="${booking.дата_окончания_бронирования}" required>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <button class="btn btn-primary" id="findAvailableRoomsBtn">
                                        Найти доступные номера
                                    </button>
                                </div>
                            </div>
                            
                            <div id="roomSelectionSection" style="display: none;">
                                <h5 class="mb-3">Доступные номера</h5>
                                <div id="availableRoomsList" class="row"></div>
                                
                                <form id="editBookingForm" class="mt-4">
                                    <input type="hidden" name="код_брони" value="${booking.код_брони}">
                                    <input type="hidden" name="код_клиента" value="${booking.код_клиента}">
                                    <input type="hidden" name="код_администратора" value="${booking.код_администратора}">
                                    <input type="hidden" name="код_номера" id="selectedRoomId">
                                    <input type="hidden" name="дата_начала_бронирования" id="finalCheckIn">
                                    <input type="hidden" name="дата_окончания_бронирования" id="finalCheckOut">
                                    
                                    <div class="mb-3">
                                        <label class="form-label">Статус</label>
                                        <select class="form-select" name="статус_бронирования" required>
                                            <option value="подтверждено" ${booking.статус_бронирования === 'подтверждено' ? 'selected' : ''}>Подтверждено</option>
                                            <option value="отменено" ${booking.статус_бронирования === 'отменено' ? 'selected' : ''}>Отменено</option>
                                            <option value="ожидание" ${booking.статус_бронирования === 'ожидание' ? 'selected' : ''}>Ожидание</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" id="saveBookingBtn" disabled>Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем модальное окно в DOM
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Инициализируем модальное окно
        const modal = new bootstrap.Modal(document.getElementById('editBookingModal'));
        modal.show();
        
        // Обработчик кнопки поиска номеров
        document.getElementById('findAvailableRoomsBtn').addEventListener('click', function() {
            const checkIn = document.getElementById('editCheckIn').value;
            const checkOut = document.getElementById('editCheckOut').value;
            
            if (!checkIn || !checkOut) {
                alert('Пожалуйста, укажите обе даты');
                return;
            }
            
            if (new Date(checkOut) <= new Date(checkIn)) {
                alert('Дата выезда должна быть позже даты заезда');
                return;
            }
            
            // Показываем loader
            const btn = this;
            btn.disabled = true;
            
            // Загружаем доступные номера
            fetch(`php/get_rooms.php?check_in=${encodeURIComponent(checkIn)}&check_out=${encodeURIComponent(checkOut)}`)
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки номеров');
                return response.json();
            })
            .then(rooms => {
                const roomsList = document.getElementById('availableRoomsList');
                roomsList.innerHTML = '';
                
                if (rooms.length === 0) {
                    roomsList.innerHTML = '<div class="col-12"><div class="alert alert-warning">Нет доступных номеров на выбранные даты</div></div>';
                    return;
                }
                
                rooms.forEach(room => {
                    const roomCard = document.createElement('div');
                    roomCard.className = 'col-md-6 mb-3';
                    roomCard.innerHTML = `
                        <div class="card h-100 ${room.id == booking.код_номера ? 'border-primary' : ''}">
                            <div class="card-body">
                                <h5 class="card-title">${room.category} №${room.number}</h5>
                                <p class="card-text">
                                    <strong>Цена за ночь:</strong> ${room.price} руб.<br>
                                    <strong>Вместимость:</strong> ${room.capacity} чел.
                                </p>
                                <button class="btn btn-${room.id == booking.код_номера ? 'primary' : 'outline-primary'} select-room-btn" 
                                    data-room-id="${room.id}">
                                    ${room.id == booking.код_номера ? 'Текущий номер' : 'Выбрать'}
                                </button>
                            </div>
                        </div>
                    `;
                    roomsList.appendChild(roomCard);
                });
                
                // Обработчики выбора номера
                document.querySelectorAll('.select-room-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        document.querySelectorAll('.select-room-btn').forEach(b => {
                            b.classList.remove('btn-primary');
                            b.classList.add('btn-outline-primary');
                            b.textContent = 'Выбрать';
                        });
                        
                        this.classList.remove('btn-outline-primary');
                        this.classList.add('btn-primary');
                        this.textContent = 'Выбран';
                        
                        document.getElementById('selectedRoomId').value = this.dataset.roomId;
                        document.getElementById('finalCheckIn').value = checkIn;
                        document.getElementById('finalCheckOut').value = checkOut;
                        
                        document.getElementById('saveBookingBtn').disabled = false;
                    });
                });
                
                // Показываем секцию выбора номера
                document.getElementById('roomSelectionSection').style.display = 'block';
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Ошибка при загрузке номеров: ' + error.message);
            })
            .finally(() => {
                btn.disabled = false;
                btn.textContent = 'Найти доступные номера';
            });
        });
        
        // Обработчик сохранения
        document.getElementById('saveBookingBtn').addEventListener('click', function() {
            if (!document.getElementById('selectedRoomId').value) {
                alert('Пожалуйста, выберите номер');
                return;
            }
            
            const formData = new FormData(document.getElementById('editBookingForm'));
            
            // Показываем loader
            const btn = this;
            btn.disabled = true;
            fetch('php/edit_booking.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert('Изменения сохранены!');
                    modal.hide();

                } else {
                    throw new Error(data.error || 'Не удалось сохранить изменения');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Ошибка: ' + error.message);
            })
            .finally(() => {
                btn.disabled = false;
                btn.textContent = 'Сохранить';
            });
        });
        
        // Удаляем модальное окно при закрытии
        document.getElementById('editBookingModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить данные бронирования: ' + error.message);
    });
}

// Функция для загрузки номеров
function loadRoomsForEdit(selectedId, checkInDate, checkOutDate) {
    const url = `php/get_rooms.php?check_in=${encodeURIComponent(checkInDate)}&check_out=${encodeURIComponent(checkOutDate)}`;
    
    fetch(url)
    .then(response => {
        if (!response.ok) throw new Error('Ошибка загрузки номеров');
        return response.json();
    })
    .then(rooms => {
        const select = document.querySelector('#editBookingModal select[name="код_номера"]');
        if (select) {
            select.innerHTML = rooms.map(room => 
                `<option value="${room.id}" ${room.id == selectedId ? 'selected' : ''}>
                    ${room.category} №${room.number} (${room.price} руб./ночь)
                </option>`
            ).join('');
        }
    })
    .catch(error => {
        console.error('Ошибка загрузки номеров:', error);
        const select = document.querySelector('#editBookingModal select[name="код_номера"]');
        if (select) {
            select.innerHTML = '<option value="">Ошибка загрузки номеров</option>';
        }
    });
}
        
        // Инициализация при загрузке страницы
        document.addEventListener('DOMContentLoaded', function() {
            
            // Обработчики для кнопок фильтрации
            document.querySelectorAll('.filter-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(function(b) {
                        b.classList.remove('active');
                    });
                    this.classList.add('active');
                });
            });
        });

        // Глобальная переменная для хранения данных о заселениях
let allCheckIns = [];
loadCheckIns();
// Функция загрузки данных о заселениях
function loadCheckIns() {
  fetch('php/get_checkins.php')
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(function(data) {
        if (data.success) {
          allCheckIns = data.data;
          console.log(data);
          renderCheckIns(allCheckIns);
          setupCheckInFilters(allCheckIns);
        } 
      })
      
    .catch(function(error) {
      console.error('Ошибка загрузки данных о заселениях:', error);
      document.getElementById('current-checkins-body').innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-danger">Ошибка загрузки данных</td>
        </tr>
      `;
    });
}
function setupCheckInFilters(allCheckIns) {
    const sortBtn = document.getElementById('sort-btn2');
    const dateFromInput = document.getElementById('date-from2');
    const dateToInput = document.getElementById('date-to2');
    
    sortBtn.addEventListener('click', () => {
      const fromDate = dateFromInput.value ? new Date(dateFromInput.value + 'T00:00:00') : null;
      const toDate = dateToInput.value ? new Date(dateToInput.value + 'T23:59:59') : null;
      
      let filteredCheckIns = [...allCheckIns];
      
      // Фильтрация по дате заселения
      if (fromDate || toDate) {
        filteredCheckIns = filteredCheckIns.filter(checkIn => {
          // Преобразуем дату заселения в объект Date
          let checkInDateStr = checkIn.дата_заселения;
          
          // Если дата в формате DD.MM.YYYY, преобразуем в YYYY-MM-DD
          if (checkInDateStr.includes('.')) {
            const parts = checkInDateStr.split('.');
            checkInDateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
          
          const checkInDate = new Date(checkInDateStr + 'T00:00:00');
          
          return (!fromDate || checkInDate >= fromDate) && 
                 (!toDate || checkInDate <= toDate);
        });
      }
      
      // Сортировка по дате заселения (новые сверху)
      filteredCheckIns.sort((a, b) => {
        let dateAStr = a.дата_заселения;
        let dateBStr = b.дата_заселения;
        
        // Преобразование формата даты, если нужно
        if (dateAStr.includes('.')) {
          const parts = dateAStr.split('.');
          dateAStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        if (dateBStr.includes('.')) {
          const parts = dateBStr.split('.');
          dateBStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        
        return new Date(dateBStr) - new Date(dateAStr); // Сортировка по убыванию (новые сверху)
      });
      
      renderCheckIns(filteredCheckIns);
    });
  }
// Функция отображения данных о заселениях
function renderCheckIns(checkIns) {
  const tbody = document.getElementById('current-checkins-body');
  tbody.innerHTML = '';
  
  if (!checkIns || checkIns.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">Нет данных о заселениях</td>
      </tr>
    `;
    return;
  }
  
  // Сортируем по дате заселения (новые сверху)
  checkIns.sort(function(a, b) {
    return new Date(b.дата_заселения) - new Date(a.дата_заселения);
  });
  
  checkIns.forEach(function(checkIn) {
    const row = document.createElement('tr');
    
    // Рассчитываем количество дней
    const days = calculateDays(checkIn.дата_заселения, checkIn.дата_выселения);
    
    // Определяем класс для статуса
    let statusClass = '';
    switch(checkIn.статус_заселения) {
      case 'заселен': statusClass = 'text-success'; break;
      case 'выселен': statusClass = 'text-secondary'; break;
      case 'не заселен': statusClass = 'text-warning'; break;
    }
    
    row.innerHTML = `
      <td>№${checkIn.код_заселения}</td>
      <td>${checkIn.номер}</td>
      <td>${checkIn.имя_гостя}</td>
      <td>${checkIn.дата_заселения}</td>
      <td>${checkIn.дата_выселения}</td>
      <td>${days}</td>
      <td class="${statusClass}">${checkIn.статус_заселения}</td>
      <td>
        ${getActionButtons(checkIn.статус_заселения, checkIn.код_заселения)}
      </td>
    `;
    
    tbody.appendChild(row);
  });
  
  // Инициализируем обработчики для кнопок
  initCheckInActionHandlers();
}

// Функции для обработки действий с промисами
function processCheckIn(checkInId, newStatus) {
    console.log("Sending data:", { id: checkInId, status: newStatus });
  
    // Создаём объект FormData
    const formData = new FormData();
    formData.append('id', checkInId);
    formData.append('status', newStatus);
  
    fetch('php/update_checkin.php', {
      method: 'POST',
      body: formData
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(function(result) {
      if (result.success) {
        loadCheckIns();
        alert('Статус успешно обновлен');
      } else {
        throw new Error(result.error || 'Неизвестная ошибка');
      }
    })
    .catch(function(error) {
      console.error('Ошибка при обновлении статуса:', error);
    });
}


// Инициализация обработчиков кнопок
function initCheckInActionHandlers() {
  document.querySelectorAll('.checkin-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      processCheckIn(this.dataset.id, 'заселен');
    });
  });
  
  document.querySelectorAll('.checkout-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      processCheckIn(this.dataset.id, 'выселен');
    });
  });
  
  document.querySelectorAll('.cancel-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      deleteCheckIn(this.dataset.id);
    });
  });
}
function getActionButtons(status, checkInId) {
  let buttons = '';
  
  if (status === 'не заселен') {
    buttons = `
      <button class="btn btn-sm btn-success checkin-btn" data-id="${checkInId}" title="Заселить">
        <i class="fas fa-sign-in-alt"></i>
      </button>
      <button class="btn btn-sm btn-danger cancel-btn" data-id="${checkInId}" title="Отменить">
        <i class="fas fa-times"></i>
      </button>
    `;
  } else if (status === 'заселен') {
    buttons = `
      <button class="btn btn-sm btn-primary checkout-btn" data-id="${checkInId}" title="Выселить">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    `;
  }
  
  return buttons;
}

function deleteCheckIn(checkInId) {
    if (!confirm('Вы уверены, что хотите отменить это заселение?')) {
      return;
    }
    
    fetch('php/delete_checkin.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `id=${encodeURIComponent(checkInId)}`
    })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(function(result) {
        if (result.success) {
          loadCheckIns(); 
          alert('Заселение удалено');
        } else {
          throw new Error(result.error || 'Неизвестная ошибка');
        }
      })
      .catch(function(error) {
        console.error('Ошибка при удалении заселения:', error);
        alert('Ошибка при удалении заселения');
      });
  }
// Вспомогательные функции (остаются без изменений)
function calculateDays(startDate, endDate) {
    if (!startDate || !endDate) return '-';
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.round((end - start) / (1000 * 60 * 60 * 24));
  }
  
  function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  }
  
  function getGuestName(guestId) {
    return `Гость #${guestId}`;
  }
  
// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  loadCheckIns();
  
  // Обновляем данные каждые 5 минут
  setInterval(loadCheckIns, 300000);
});

loadTodayDepartures();
// Функция для загрузки и отображения сегодняшних выселений
function loadTodayDepartures() {
    fetch('php/get_departures.php?today=true')
      .then(response => {
          return response.json();
      })
      .then(data => {
          const container = document.getElementById('today-departures-container');
          const counter = document.getElementById('departures-counter');
          
          // Проверяем, что data существует и является массивом
          if (!Array.isArray(data?.data)) {
              container.innerHTML = `
                <div class="alert alert-warning">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  Ошибка формата данных: сервер вернул не массив
                </div>
              `;
              console.error('Ожидался массив, получено:', data);
              return;
          }
          
          const checkIns = data.data || [];
          
          if (checkIns.length === 0) {
              container.innerHTML = `
                <div class="alert alert-info">
                  <i class="fas fa-info-circle me-2"></i>Сегодня нет запланированных выселений
                </div>
              `;
              counter.textContent = 'Сегодня нет выселений';
              return;
          }
          
          // Обновляем счетчик
          counter.textContent = `Сегодня запланировано ${checkIns.length} выселений`;
          
          // Очищаем контейнер
          container.innerHTML = '';
          
          // Добавляем карточки для каждого выселения
          checkIns.forEach(checkIn => {
              const daysStayed = calculateDays(checkIn.дата_заселения, new Date().toISOString().split('T')[0]);
              
              const card = document.createElement('div');
              card.className = 'card mb-3';
              card.innerHTML = `
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title">${checkIn.имя_гостя}</h5>
                    <span class="badge bg-primary">Номер ${checkIn.номер}</span>
                  </div>
                  <div class="row mt-2">
                    <div class="col-md-6">
                      <p class="mb-1"><i class="fas fa-calendar-day me-2"></i>Заселен: ${formatDate(checkIn.дата_заселения)}</p>
                      <p class="mb-1"><i class="fas fa-calendar-check me-2"></i>Выселение: ${formatDate(checkIn.дата_выселения)}</p>
                    </div>
                    <div class="col-md-6">
                      <p class="mb-1"><i class="fas fa-moon me-2"></i>Прожито дней: ${daysStayed}</p>
                      <p class="mb-1"><i class="fas fa-id-card me-2"></i>ID: ${checkIn.код_заселения}</p>
                    </div>
                  </div>
                  <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                    <button class="btn btn-danger checkout-btn" data-id="${checkIn.код_заселения}">
                      <i class="fas fa-sign-out-alt me-1"></i> Выселить
                    </button>
                  </div>
                </div>
              `;
              
              container.appendChild(card);
          });
          
          // Инициализируем обработчики кнопок
          initCheckOutHandlers();
      })
      .catch(error => {
          console.error('Ошибка загрузки выселений:', error);
          document.getElementById('today-departures-container').innerHTML = `
            <div class="alert alert-danger">
              <i class="fas fa-times-circle me-2"></i>
              Произошла ошибка при загрузке данных: ${error.message}
            </div>
          `;
          document.getElementById('departures-counter').textContent = 
            'Ошибка загрузки данных';
      });
}
  
  // Обработчики для кнопок выселения
  function initCheckOutHandlers() {
    document.querySelectorAll('#today-departures-container .checkout-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const checkInId = this.dataset.id;
            const button = this; // Сохраняем ссылку на кнопку
            
            // Блокируем кнопку на время выполнения запроса
            button.disabled = true;
        
            
            processCheckIn(checkInId, 'выселен')
                .then(() => {
                    // После успешного выселения меняем текст и делаем кнопку неактивной
                    button.innerHTML = '<i class="fas fa-check me-1"></i> Выселен';
                    button.classList.remove('btn-danger');
                    button.classList.add('btn-secondary');
                    button.disabled = true;
                    
                    // Можно также обновить статус в карточке, если нужно
                    const statusElement = button.closest('.card').querySelector('.status-text');
                    if (statusElement) {
                        statusElement.textContent = 'выселен';
                        statusElement.classList.remove('text-success');
                        statusElement.classList.add('text-secondary');
                    }
                })
                .catch(error => {
                    console.error('Ошибка при выселении:', error);
                    // Восстанавливаем кнопку при ошибке
                    button.innerHTML = '<i class="fas fa-sign-out-alt me-1"></i> Выселить';
                    button.disabled = false;
                    alert('Ошибка при выселении: ' + error.message);
                });
        });
    });
}
  
  document.querySelector('#departures-tab').addEventListener('shown.bs.tab', loadTodayDepartures);
  

  document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('#departures-tab').classList.contains('active')) {
      loadTodayDepartures();
    }
  });

    loadClients();
    initClientSearch();
    initClientModal();

function loadClients() {
    fetch('php/get_clients.php')
        .then(response => {
            return response.json();
        })
        .then(clients => {
            const tbody = document.querySelector('.clients table tbody');
            const counter = document.querySelector('.card-header .text-muted');
            
            if (!tbody || !counter) {
                console.error('Не найдены элементы DOM');
                return;
            }
            
            tbody.innerHTML = '';
            
            if (!clients || clients.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">Клиенты не найдены</td></tr>';
                counter.textContent = 'Всего: 0';
                return;
            }
            
            counter.textContent = `Всего: ${clients.length}`;
            
            clients.forEach((client, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${client.id}</td>
                    <td>${client.full_name || 'Не указано'}</td>
                    <td>
                        <div>${client.phone || 'Не указан'}</div>
                        <small class="text-muted">${client.email || 'нет email'}</small>
                    </td>
                    <td>${client.last_visit ? formatDate(client.last_visit) : 'Нет данных'}</td>
                    <td>${client.visits_count || 0}</td>
                    <td><span class="badge ${getStatusClass(client.status || 'Новый')}">${client.status || 'Новый'}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-client" data-id="${client.id}" title="Редактировать">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info history-client" data-id="${client.id}" title="История">
                            <i class="fas fa-history"></i>
                        </button>
                          <button class="btn btn-sm btn-outline-warning view-children" data-client-id="${client.id}" title="Дети">
                                            <i class="fas fa-child"></i>
                         </button>
                           <button class="btn btn-sm btn-outline-danger delete_client" data-client-id="${client.id}" title="Дети">
                                            <i class="fas fa-trash"></i>
                         </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            initClientActions();
        })
        .catch(error => {
            console.error('Ошибка загрузки клиентов:', error);
            const tbody = document.querySelector('.clients table tbody');
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Ошибка загрузки: ${error.message}</td></tr>`;
            }
        });
}

$("#addClientModalBtn").click(function() {
    $("#addClientModal").toggleClass("active");
    $(this).find('i').toggleClass('fa-plus fa-times');
    $(this).toggleClass('btn-primary');
  });
  
  $(".btn-secondary").click(function() {
    $("#addClientModal").removeClass("active");
    $("#addClientModalBtn").find('i').removeClass('fa-times').addClass('fa-plus');
  });
  

function initClientSearch() {
    const searchInput = document.querySelector('#clientSearch');
    
    searchInput.addEventListener('input', function(e) {
        const searchText = this.value.toLowerCase();
        const rows = document.querySelectorAll('.clients table tbody tr');
        
        rows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes(searchText)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
    
    const searchButton = document.querySelector('.clients .btn-outline-secondary');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchText = searchInput.value.toLowerCase();
            const rows = document.querySelectorAll('.clients table tbody tr');
            
            rows.forEach(row => {
                const rowText = row.textContent.toLowerCase();
                if (rowText.includes(searchText)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}

function initClientModal() {
    const addClientModalEl = document.getElementById('addClientModal');
    if (!addClientModalEl) return;

    const clientForm = document.getElementById('clientForm');
    if (!clientForm) return;

    // Инициализируем модальное окно Bootstrap
    const clientModal = new bootstrap.Modal(addClientModalEl);

    // Получаем все элементы формы
    const fullNameInput = clientForm.querySelector('[name="full_name"]');
    const birthDateInput = clientForm.querySelector('[name="date"]');
    const passportInput = clientForm.querySelector('[name="pasport"]');
    const phoneInput = clientForm.querySelector('[name="phone"]');
    const emailInput = clientForm.querySelector('[name="email"]');

    // Добавляем обработчики валидации для всех полей
    fullNameInput.addEventListener('input', () => validateFIO(fullNameInput.value, '[name="full_name"]'));
    birthDateInput.addEventListener('change', () => validateBirth(birthDateInput.value));
    passportInput.addEventListener('input', () => validatePassport(passportInput.value));
    phoneInput.addEventListener('input', () => validatePhone(phoneInput.value, '[name="phone"]'));
    emailInput.addEventListener('input', () => validateEmail(emailInput.value));

    // Обработчик для кнопки добавления ребенка
    document.getElementById('addChildBtn').addEventListener('click', function() {
        addChildBlock();
    });

    // Функция для добавления блока ребенка с валидацией
    function addChildBlock(child = {}) {
        const childBlock = document.createElement('div');
        childBlock.className = 'child-block mb-2 p-2 border rounded';
        childBlock.innerHTML = `
            <div class="row g-2">
                <div class="col-md-3">
                    <input type="text" class="form-control form-control-sm" name="child_lastName" 
                        value="${child.lastName || ''}" placeholder="Фамилия" required>
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control form-control-sm" name="child_firstName" 
                        value="${child.firstName || ''}" placeholder="Имя" required>
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control form-control-sm" name="child_middleName" 
                        value="${child.middleName || ''}" placeholder="Отчество">
                </div>
                <div class="col-md-2">
                    <input type="date" class="form-control form-control-sm" name="child_birthDate" 
                        value="${child.birthDate || ''}">
                </div>
                <div class="col-md-1">
                    <button type="button" class="btn btn-sm btn-danger w-100 remove-child">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        // Добавляем обработчики валидации для полей ребенка
        const lastNameInput = childBlock.querySelector('[name="child_lastName"]');
        const firstNameInput = childBlock.querySelector('[name="child_firstName"]');
        const birthDateInput = childBlock.querySelector('[name="child_birthDate"]');

        lastNameInput.addEventListener('input', () => {
            validateName(lastNameInput.value, 'Введите фамилию ребенка');
        });
        firstNameInput.addEventListener('input', () => {
            validateName(firstNameInput.value, 'Введите имя ребенка');
        });
        birthDateInput.addEventListener('change', () => {
            const index = Array.from(document.querySelectorAll('.child-block')).indexOf(childBlock);
            validateChildBirth(birthDateInput.value, index);
        });

        childBlock.querySelector('.remove-child').addEventListener('click', () => {
            childBlock.remove();
        });

        document.getElementById('childrenContainer').appendChild(childBlock);
    }

    // Обработчик для кнопки добавления клиента
    const addClientBtn = document.getElementById('addClientModalBtn');
    if (addClientBtn) {
        addClientBtn.addEventListener('click', function() {
            clientForm.reset();
            clientForm.dataset.id = '';
            document.getElementById('childrenContainer').innerHTML = '';
            const modalTitle = document.getElementById('modalClientTitle');
            if (modalTitle) modalTitle.textContent = 'Добавить клиента';
            clientModal.show();
        });
    }

    clientForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Валидация всех полей перед отправкой
        const isFullNameValid = validateFIO(fullNameInput.value, '[name="full_name"]');
        const isBirthDateValid = validateBirth(birthDateInput.value);
        const isPassportValid = validatePassport(passportInput.value);
        const isPhoneValid = validatePhone(phoneInput.value, '[name="phone"]');
        const isEmailValid = validateEmail(emailInput.value);

        // Валидация детей
        let areChildrenValid = true;
        const childrenBlocks = document.querySelectorAll('.child-block');
        childrenBlocks.forEach((childEl, index) => {
            const lastName = childEl.querySelector('[name="child_lastName"]').value.trim();
            const firstName = childEl.querySelector('[name="child_firstName"]').value.trim();
            const birthDate = childEl.querySelector('[name="child_birthDate"]').value;

            if (!validateName(lastName, 'Введите фамилию ребенка')) {
                areChildrenValid = false;
            }
            if (!validateName(firstName, 'Введите имя ребенка')) {
                areChildrenValid = false;
            }
            if (!validateChildBirth(birthDate, index)) {
                areChildrenValid = false;
            }
        });

        // Если есть ошибки валидации - не отправляем форму
        if (!isFullNameValid || !isBirthDateValid || !isPassportValid || 
            !isPhoneValid || !isEmailValid || !areChildrenValid) {
            return false;
        }

        // Подготовка данных для отправки
        const formData = new FormData(clientForm);
        if (clientForm.dataset.id) {
            formData.append('id', clientForm.dataset.id);
        }

        // Добавляем данные детей
        childrenBlocks.forEach((childEl, index) => {
            const lastName = childEl.querySelector('[name="child_lastName"]').value.trim();
            const firstName = childEl.querySelector('[name="child_firstName"]').value.trim();
            const middleName = childEl.querySelector('[name="child_middleName"]').value.trim();
            const birthDate = childEl.querySelector('[name="child_birthDate"]').value;

            formData.append(`children[${index}][lastName]`, lastName);
            formData.append(`children[${index}][firstName]`, firstName);
            formData.append(`children[${index}][middleName]`, middleName);
            formData.append(`children[${index}][birthDate]`, birthDate);
        });

        // Отправка формы
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;

        const endpoint = clientForm.dataset.id ? 'php/update_client.php' : 'php/add_client.php';
        
        fetch(endpoint, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            return response.json();
        })
        .then(result => {
            if (result.success) {
                clientModal.hide();
                loadClients();
                alert(result.message || 'Данные успешно сохранены');
            } else {
                throw new Error(result.error || 'Ошибка при сохранении');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        });
    });
}

function initClientActions() {
    let clientId = null;
    const clientForm = document.getElementById('clientForm');
    const addClientModalEl = document.getElementById('addClientModal');

    document.querySelectorAll('.edit-client').forEach(btn => {
        btn.addEventListener('click', function () {
            clientId = this.dataset.id;
            const originalBtnContent = this.innerHTML;

            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;

            const formData = new FormData();
            formData.append('id', clientId);

            fetch('php/get_client.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки данных');
                return response.json();
            })
            .then(client => {
                clientForm.reset();
                document.getElementById('childrenContainer').innerHTML = '';
                clientForm.querySelector('input[name="full_name"]').value = client.full_name || '';
                clientForm.querySelector('input[name="date"]').value = client.date || '';
                clientForm.querySelector('input[name="pasport"]').value = client.pasport || '';
                clientForm.querySelector('input[name="phone"]').value = client.phone || '';
                clientForm.querySelector('input[name="email"]').value = client.email || '';

                if (client.children && client.children.length > 0) {
                    client.children.forEach(child => {
                        addChildBlock(child);
                    });
                }

                const EditModal = new bootstrap.Modal(addClientModalEl);
                EditModal.show();
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Не удалось загрузить данные клиента: ' + error.message);
            })
            .finally(() => {
                this.innerHTML = originalBtnContent;
                this.disabled = false;
            });
        });
    });

    // Функция для добавления блока ребенка
    function addChildBlock(child = {}) {
        const childBlock = document.createElement('div');
        childBlock.className = 'child-block mb-2 p-2 border rounded';
        childBlock.innerHTML = `
            <div class="row g-2">
                <div class="col-md-3">
                    <input type="text" class="form-control form-control-sm" name="child_lastName" 
                        value="${child.lastName || ''}" placeholder="Фамилия" required>
                         <div class="invalid-feedback"></div>
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control form-control-sm" name="child_firstName" 
                        value="${child.firstName || ''}" placeholder="Имя" required>
                         <div class="invalid-feedback"></div>
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control form-control-sm" name="child_middleName" 
                        value="${child.middleName || ''}" placeholder="Отчество">
                         <div class="invalid-feedback"></div>
                </div>
                <div class="col-md-2">
                    <input type="date" class="form-control form-control-sm" name="child_birthDate" 
                        value="${child.birthDate || ''}">
                         <div class="invalid-feedback"></div>
                </div>
                <div class="col-md-1">
                    <button type="button" class="btn btn-sm btn-danger w-100 remove-child">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        // Добавляем обработчики валидации для полей ребенка
        childBlock.querySelector('[name="child_lastName"]').addEventListener('input', function() {
            validateName(this.value, 'Введите фамилию ребенка');
        });
        childBlock.querySelector('[name="child_firstName"]').addEventListener('input', function() {
            validateName(this.value, 'Введите имя ребенка');
        });
        childBlock.querySelector('[name="child_birthDate"]').addEventListener('change', function() {
            const index = Array.from(document.querySelectorAll('.child-block')).indexOf(childBlock);
            validateChildBirth(this.value, index);
        });

        childBlock.querySelector('.remove-child').addEventListener('click', () => {
            childBlock.remove();
        });

        document.getElementById('childrenContainer').appendChild(childBlock);
    }

    // Обработчик для кнопки добавления ребенка
    document.getElementById('addChildBtn').addEventListener('click', function() {
        addChildBlock();
    });

    clientForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Валидация полей перед отправкой
        const fullNameValid = validateFIO(clientForm.querySelector('[name="full_name"]').value, '[name="full_name"]');
        const passportValid = validatePassport(clientForm.querySelector('[name="pasport"]').value);
        const phoneValid = validatePhone(clientForm.querySelector('[name="phone"]').value, '[name="phone"]');
        const emailValid = validateEmail(clientForm.querySelector('[name="email"]').value);
        const birthDateValid = validateBirth(clientForm.querySelector('[name="date"]').value);

        // Валидация детей
        let childrenValid = true;
        const childrenBlocks = document.querySelectorAll('.child-block');
        childrenBlocks.forEach((childEl, index) => {
            const lastName = childEl.querySelector('[name="child_lastName"]').value.trim();
            const firstName = childEl.querySelector('[name="child_firstName"]').value.trim();
            const birthDate = childEl.querySelector('[name="child_birthDate"]').value;

            if (!validateName(lastName, 'Введите фамилию ребенка')) {
                childrenValid = false;
            }
            if (!validateName(firstName, 'Введите имя ребенка')) {
                childrenValid = false;
            }
            if (!validateChildBirth(birthDate, index)) {
                childrenValid = false;
            }
        });

        if (!fullNameValid || !passportValid || !phoneValid || !emailValid || !birthDateValid || !childrenValid) {
            return false;
        }

        const formData = new FormData(this);
        formData.append('id', clientId);

        childrenBlocks.forEach((childEl, index) => {
            const lastName = childEl.querySelector('[name="child_lastName"]').value.trim();
            const firstName = childEl.querySelector('[name="child_firstName"]').value.trim();
            const middleName = childEl.querySelector('[name="child_middleName"]').value.trim();
            const birthDate = childEl.querySelector('[name="child_birthDate"]').value;

            formData.append(`children[${index}][lastName]`, lastName);
            formData.append(`children[${index}][firstName]`, firstName);
            formData.append(`children[${index}][middleName]`, middleName);
            formData.append(`children[${index}][birthDate]`, birthDate);
        });

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;

        fetch('php/update_client.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            return response.json();
        })
        .then(result => {
            if (result.success) {
                const modal = new bootstrap.Modal(addClientModalEl);
                modal.hide();
                
                loadClients();
                alert('Успешно!');
            } else {
                throw new Error(result.error || 'Ошибка при обновлении');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        })
        .finally(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        });
    });

    // Просмотр истории клиента (с FormData)
    document.querySelectorAll('.history-client').forEach(btn => {
        btn.addEventListener('click', function() {
            const clientId = this.dataset.id;
            const formData = new FormData();
            formData.append('client_id', clientId);
            
            fetch('php/get_client_history.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(history => {
                const modalElement = document.getElementById('historyModal');

                if (!modalElement) {
                    throw new Error('Модальное окно не найдено');
                }
                
                const historyModal = new bootstrap.Modal(modalElement);
                const historyTable = document.querySelector('.history-table tbody');
                historyTable.innerHTML = '';
                
                history.forEach(entry => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${formatDate(entry.check_in)}</td>
                        <td>${formatDate(entry.check_out)}</td>
                    `;
                    historyTable.appendChild(row);
                });
                
                historyModal.show();
            });
        });
    });
    // Просмотр детей клиента (с FormData)
    document.querySelectorAll('.view-children').forEach(btn => {
        btn.addEventListener('click', function() {
            const clientId = this.dataset.clientId;
            console.log('Запрошены дети клиента ID:', clientId); 
            
            const formData = new FormData();
            formData.append('client_id', clientId);
            
            fetch('php/get_client_children.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                console.log('Ответ сервера:', response); 
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(children => {
                console.log('Полученные данные о детях:', children); 
                
                const modalElement = document.getElementById('childrenModal');
                if (!modalElement) {
                    throw new Error('Модальное окно не найдено');
                }
                
                const childrenModal = new bootstrap.Modal(modalElement);
                const childrenList = modalElement.querySelector('.children-list');
                
                if (!childrenList) {
                    throw new Error('Элемент для списка детей не найден');
                }
                
                childrenList.innerHTML = '';
                
                if (!children || children.length === 0) {
                    childrenList.innerHTML = '<li class="text-muted">У клиента нет детей.</li>';
                } else {
                    children.forEach(child => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.innerHTML = `
                            <div class="d-flex justify-content-between align-items-center">
                                <span>
                                    ${child.lastName || ''} ${child.firstName || ''} ${child.middleName || ''}
                                </span>
                                <small class="text-muted">
                                    ${child.birthDate ? formatDate(child.birthDate) : 'Дата рождения не указана'}
                                </small>
                            </div>
                        `;
                        childrenList.appendChild(li);
                    });
                }
                
                childrenModal.show();
            })
            .catch(error => {
                console.error('Ошибка при получении детей:', error);
                alert('Не удалось загрузить информацию о детях: ' + error.message);
            });
        });
    });
    document.querySelectorAll('.delete_client').forEach(btn => {
        btn.addEventListener('click', function() {
            const clientId = this.dataset.clientId;
            if (confirm('Вы уверены, что хотите удалить клиента?')) {
                const formData = new FormData();
                formData.append('id', clientId);
                
                fetch('php/delete_client.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        loadClients();
                        alert('success', 'Клиент удален');
                    } else {
                        throw new Error(result.error || 'Не удалось удалить клиента');
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    alert('danger', error.message);
                });
            }
        });
    });
}

// Вспомогательные функции
function formatDate(dateString) {
    if (!dateString) return 'никогда';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'постоянный': return 'bg-success';
        case 'новый': return 'bg-primary';
        case 'неактивный': return 'bg-secondary';
        default: return 'bg-warning';
    }
}

// Обработка кнопки "Добавить ребенка"
const childrenContainer = document.getElementById('childrenContainer');
const addChildBtn = document.getElementById('addChildBtn');

addChildBtn.addEventListener('click', () => {
    const childIndex = childrenContainer.children.length;
    const childGroup = document.createElement('div');
    childGroup.classList.add('child-group', 'mb-2');
    childGroup.innerHTML = `
        <div class="d-flex gap-2 mb-1">
           <div class="child-block">
    <input type="text" name="child_lastName" placeholder="Фамилия ребенка">
    <input type="text" name="child_firstName" placeholder="Имя ребенка">
    <input type="text" name="child_middleName" placeholder="Отчество ребенка">
    <input type="date" name="child_birthDate" placeholder="Дата рождения">
            <button type="button" class="btn btn-danger btn-sm remove-child">✕</button>
        </div>
    `;
    childrenContainer.appendChild(childGroup);

    // Обработка удаления
    childGroup.querySelector('.remove-child').addEventListener('click', () => {
        childGroup.remove();
    });
});


loadRooms();
initRoomCalendar();
function initRoomFilters() {
    // Создаем контейнер для кнопок фильтрации
    const filterContainer = document.createElement('div');
    filterContainer.className = 'mb-3 d-flex gap-2 flex-wrap';
    filterContainer.innerHTML = `
        <button class="btn btn-sm btn-outline-secondary filter-btn active" data-category="all">Все</button>
        <button class="btn btn-sm btn-outline-secondary filter-btn" data-category="эконом">эконом</button>
        <button class="btn btn-sm btn-outline-secondary filter-btn" data-category="стандарт">стандарт</button>
        <button class="btn btn-sm btn-outline-secondary filter-btn" data-category="комфорт">комфорт</button>
    `;
    
    // Вставляем кнопки перед карточкой с таблицей
    const roomsSection = document.querySelector('.rooms .row > .col-md-8');
    roomsSection.insertBefore(filterContainer, roomsSection.querySelector('.card'));

    // Обработчик кликов по кнопкам фильтрации
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterRoomsByCategory(category);
            
            // Обновляем активную кнопку
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Функция фильтрации номеров по категории
function filterRoomsByCategory(category) {
    const rows = document.querySelectorAll('.rooms table tbody tr');
    
    rows.forEach(row => {
        const rowCategory = row.querySelector('td:nth-child(2)').textContent.trim();
        
        if (category === 'all' || rowCategory === category) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Обновленная функция loadRooms
function loadRooms() {
    fetch('php/rooms.php')
        .then(response => response.json())
        .then(rooms => {
            const tbody = document.querySelector('.rooms table tbody');
            tbody.innerHTML = '';
            
            if (rooms.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center">Номера не найдены</td></tr>';
                return;
            }
            
            // Сортируем номера по категориям
            const categoryOrder = ['эконом', 'стандарт', 'комфорт'];
            rooms.sort((a, b) => {
                return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
            });
            
            // Заполняем таблицу
            rooms.forEach(room => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${room.number || room.id}</td>
                    <td>${room.category}</td>
                    <td>
                        <span class="room-status room-status-${room.status}"></span>
                        ${room.status}
                    </td>
                    <td>${room.capacity}</td>
                    <td>${room.area} м²</td>
                    <td>${room.price} ₽/ночь</td>
                    <td>
                        ${room.amenities.map(a => `<span class="badge bg-light text-dark me-1">${a}</span>`).join('')}
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary edit-room" data-id="${room.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Инициализируем фильтры и действия
            initRoomFilters();
            initRoomActions();
            updateRoomStats(rooms);
        })
        .catch(error => {
            console.error('Ошибка загрузки номеров:', error);
            const tbody = document.querySelector('.rooms table tbody');
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Ошибка загрузки данных</td></tr>';
        });
}
function initRoomActions() {
    let roomId = null;
    const roomForm = document.getElementById('roomForm');
    const addRoomModalEl = document.getElementById('addRoomModal');

    // Добавляем валидацию для поля цены
    const priceInput = roomForm.querySelector('input[name="price"]');
    priceInput.addEventListener('input', function() {
        validatePrice(this.value);
    });

    function validatePrice(price) {
        const isValid = price >= 0;
        setValidationState('#roomPrice', isValid, 'Цена не может быть отрицательной');
        return isValid;
    }

    document.querySelectorAll('.edit-room').forEach(btn => {
        btn.addEventListener('click', function() {
            roomId = this.dataset.id;
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            const formData = new FormData();
            formData.append('id', roomId);
            
            fetch('php/get_room.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки данных');
                return response.json();
            })
            .then(data => {
                if (!data.success) throw new Error(data.error || 'Неизвестная ошибка');

                const room = data.room;
                roomForm.reset();

                // Заполнение основных полей
                roomForm.querySelector('input[name="number"]').value = room.id;
                roomForm.querySelector('input[name="capacity"]').value = room.capacity;
                roomForm.querySelector('input[name="area"]').value = room.area;
                roomForm.querySelector('input[name="price"]').value = room.price;
                roomForm.querySelector('input[name="category"]').value = room.category;

                // Заполнение статусов и удобств
                const statusContainer = document.querySelector('.status-checkboxes');
                const amenitiesContainer = document.querySelector('.amenities-checkboxes');
                
                statusContainer.innerHTML = '';
                amenitiesContainer.innerHTML = '';
                
                // Статусные чекбоксы
                const statuses = ["свободен", "занят"];
                statuses.forEach(status => {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = 'status';
                    checkbox.value = status;
                    checkbox.id = `status-${status}`;
                
                    if (room.status === status) {
                        checkbox.checked = true;
                    }
                
                    const label = document.createElement('label');
                    label.htmlFor = `status-${status}`;
                    label.textContent = status;
                    label.style.marginRight = '10px';
                
                    const wrapper = document.createElement('div');
                    wrapper.classList.add('form-check');
                    wrapper.appendChild(checkbox);
                    wrapper.appendChild(label);
                
                    statusContainer.appendChild(wrapper);
                });
                
                // Чекбоксы для удобств
                data.all_amenities.forEach(amenity => {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = 'amenities[]';
                    checkbox.value = amenity.name;
                    checkbox.id = `amenity-${amenity.id}`;
                
                    if (room.amenities.includes(amenity.name)) {
                        checkbox.checked = true;
                    }
                
                    const label = document.createElement('label');
                    label.htmlFor = `amenity-${amenity.id}`;
                    label.textContent = amenity.name;
                    label.style.marginRight = '10px';
                
                    const wrapper = document.createElement('div');
                    wrapper.classList.add('form-check');
                    wrapper.appendChild(checkbox);
                    wrapper.appendChild(label);
                
                    amenitiesContainer.appendChild(wrapper);
                });

                const amenityCheckboxes = roomForm.querySelectorAll('input[name="amenities[]"]');
                amenityCheckboxes.forEach(checkbox => {
                    checkbox.disabled = true;
                });

                const editModal = new bootstrap.Modal(addRoomModalEl);
                editModal.show();
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Не удалось загрузить данные номера: ' + error.message);
            })
            .finally(() => {
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-edit"></i>';
            });
        });
    });

    // Обработчик отправки формы
    roomForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Валидация цены перед отправкой
        const price = parseFloat(priceInput.value);
        if (!validatePrice(price)) {
            return false;
        }

        const formData = new FormData(this);
        formData.append('id', roomId);

        // Собираем выбранный статус
        const selectedStatus = this.querySelector('input[name="status"]:checked');
        if (selectedStatus) {
            formData.append('status', selectedStatus.value);
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;

        fetch('php/update_room.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            return response.json();
        })
        .then(result => {
            if (result.success) {
                const modal = bootstrap.Modal.getInstance(addRoomModalEl);
                modal.hide();
                alert('Данные номера успешно обновлены!');
                // Здесь можно обновить список номеров, если нужно
            } else {
                throw new Error(result.error || 'Ошибка при обновлении');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка: ' + error.message);
        })
        .finally(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        });
    });

    // Функция для установки состояния валидации
    function setValidationState(selector, isValid, errorMsg) {
        const field = document.querySelector(selector);
        const feedback = field.nextElementSibling;
        
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            if (feedback) feedback.textContent = '';
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            if (feedback) feedback.textContent = errorMsg;
        }
    }
}
// Обновление статистики
function updateRoomStats(rooms) {
    // Группировка по категориям
    const stats = {};
    rooms.forEach(room => {
        if (!stats[room.category]) {
            stats[room.category] = { total: 0, occupied: 0 };
        }
        stats[room.category].total++;
        if (room.status !== 'свободен') stats[room.category].occupied++;
    });
    
    // Обновляем прогресс-бары в контейнере статистики
    const statsContainer = document.querySelector('.col-md-4 .card-body');
    statsContainer.innerHTML = '';  // Очищаем контейнер перед обновлением
    
    for (const [category, data] of Object.entries(stats)) {
        const percent = Math.round((data.occupied / data.total) * 100);
        statsContainer.innerHTML += `
            <div class="mb-3">
                <h6>${category} <small class="text-muted float-end">${data.occupied} из ${data.total} занято</small></h6>
                <div class="progress">
                    <div class="progress-bar ${percent > 70 ? 'bg-danger' : percent > 30 ? 'bg-warning' : 'bg-success'}" 
                         style="width: ${percent}%"></div>
                </div>
            </div>
        `;
    }
}

// Инициализация календаря
function initRoomCalendar() {
    const calendarEl = document.getElementById('rooms-calendar-view');
    if (!calendarEl || calendarEl._fullCalendar) return;
    
    const calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'ru',
        initialView: 'dayGridMonth',
        events: {
            url: 'php/get_room_bookings.php',
            method: 'GET',
            failure: function() {
                alert('Ошибка загрузки бронирований');
            }
        },
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        eventClick: function(info) {
            const event = info.event;
            alert(`Бронирование: ${event.title}\n` +
                  `ID номера: ${event.extendedProps.room_id}\n` +
                  `Категория: ${event.extendedProps.category}\n` +
                  `Статус: ${event.extendedProps.status}\n` +
                  `Даты: ${event.start.toLocaleDateString()} - ${event.end.toLocaleDateString()}`);
        },
        eventDisplay: 'block'
        
    });
    
    calendar.render();
    calendarEl._fullCalendar = true;
}


initAnalytics();


function initAnalytics() {
    // Устанавливаем период по умолчанию (последние 30 дней)
      // 1. Получаем текущую дату и дату 30 дней назад
      const endDate = new Date(); // Текущая дата
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30); // 30 дней назад
      
      // 2. Форматируем даты в формат YYYY-MM-DD (требуется для input[type="date"])
      const formatDateForInput = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
      };
      
      // 3. Находим поля ввода
      const inputs = document.querySelectorAll('.analytic input[type="date"]');
      
      // 4. Устанавливаем значения (используем value вместо valueAsDate)
      if (inputs.length >= 2) {
          inputs[0].value = formatDateForInput(startDate);
          inputs[1].value = formatDateForInput(endDate);
          
          // Для отладки - выводим в консоль
          console.log('Установлены даты:', {
              startDate: inputs[0].value,
              endDate: inputs[1].value
          });
      } else {
          console.error('Не найдены поля для дат');
      }
      
    // Инициализируем график
    initOccupancyChart();
    
    // Добавляем обработчики событий
    document.querySelector('.analytic .btn-primary').addEventListener('click', generateReport);
    document.querySelector('.analytic .btn-outline-primary').addEventListener('click', exportReport);
    
    // Первоначальная загрузка данных
    loadAnalyticsData(startDate, endDate);
}

// Инициализация графика загрузки номеров
function initOccupancyChart() {
    const ctx = document.getElementById('occupancyChart').getContext('2d');
    window.occupancyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['эконом', 'стандарт', 'комфорт'],
            datasets: [{
                label: 'Загрузка номеров (%)',
                data: [65, 78, 82],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 50,
                    title: {
                        display: true,
                        text: 'Процент загрузки'
                    }
                }
            }
        }
    });
}
function loadAnalyticsData(startDate, endDate) {
    const reportType = document.querySelector('.analytic select').value;
    const url = `php/get_analytics.php?start=${formatDate2(startDate)}&end=${formatDate2(endDate)}&type=${reportType}`;
    
    console.log('Fetching analytics data from:', url);
    
    fetch(url)
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data);
            updateCharts(data);
            updateFinancialStats(data.financial);
            updateClientStats(data.clients);
        })
        .catch(error => {
            console.error('Ошибка загрузки аналитики:', error);
            alert('Не удалось загрузить данные аналитики');
        });
}

// Обновление графиков
function updateCharts(data) {
    window.occupancyChart.data.labels = data.categories;
    window.occupancyChart.data.datasets[0].data = data.occupancy;
    window.occupancyChart.update();
}

function updateFinancialStats(stats) {
    // Находим все карточки и фильтруем по заголовку
    const cards = document.querySelectorAll('.analytic .card');
    let financeCard;
    
    cards.forEach(card => {
        const header = card.querySelector('.card-header');
        if (header && header.textContent.includes('Финансовые показатели')) {
            financeCard = card;
        }
    });
    
    if (!financeCard) {
        console.error('Не найдена карточка финансовых показателей');
        return;
    }
    
    // Обновляем данные
    financeCard.querySelector('.text-success').textContent = `${stats.totalIncome.toLocaleString('ru-RU')} ₽`;
    financeCard.querySelector('h4').textContent = `${stats.averageCheck.toLocaleString('ru-RU')} ₽`;
    
    // Обновляем прогресс-бар
    const progressBar = financeCard.querySelector('.progress-bar');
    progressBar.style.width = `${stats.occupancy}%`;
    progressBar.textContent = `${stats.occupancy}%`;
}

// Обновление клиентской статистики
function updateClientStats(stats) {
    // Находим все карточки и фильтруем по заголовку
    const cards = document.querySelectorAll('.analytic .card');
    let clientCard;
    
    cards.forEach(card => {
        const header = card.querySelector('.card-header');
        if (header && header.textContent.includes('Клиентская статистика')) {
            clientCard = card;
        }
    });
    
    if (!clientCard) {
        console.error('Не найдена карточка клиентской статистики');
        return;
    }
    
    // Обновляем данные
    const clientElements = clientCard.querySelectorAll('.card-body h4');
    if (clientElements.length >= 3) {
        clientElements[0].textContent = stats.newClients;
        clientElements[1].textContent = `${stats.regularClients}%`;
        clientElements[2].textContent = `${stats.avgStayDays} ${getDayText(stats.avgStayDays)}`;
    }
}
// Вспомогательная функция для склонения слова "день"
function getDayText(days) {
    days = Math.floor(days);
    const lastDigit = days % 10;
    const lastTwoDigits = days % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'дней';
    if (lastDigit === 1) return 'день';
    if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
    return 'дней';
}

 // Генерация отчета
 function generateReport() {
    const dateInputs = document.querySelectorAll('.analytic input[type="date"]');
    const startDateStr = dateInputs[0].value; // Первое поле - начало
    const endDateStr = dateInputs[1].value;   // Второе поле - конец
    
    if (!startDateStr || !endDateStr) {
        alert('Укажите период для формирования отчета');
        return;
    }
    
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    if (startDate > endDate) {
        alert('Дата начала периода не может быть позже даты окончания');
        return;
    }
    
    loadAnalyticsData(startDate, endDate);
}


// Экспорт отчета
async function exportReport() {
    const dateInputs = document.querySelectorAll('.analytic input[type="date"]');
    const startDate = dateInputs[0].value; // Начало периода
    const endDate = dateInputs[1].value;   // Конец периода
    const reportType = document.querySelector('.analytic select').value;
    
    if (!startDate || !endDate) {
        alert('Укажите период для экспорта отчета');
        return;
    }

    const exportBtn = document.querySelector('.analytic .btn-outline-primary');
    const originalText = exportBtn.innerHTML;
    exportBtn.disabled = true;

    try {
        // Получаем данные с указанием обеих дат
        const response = await fetch(`php/get_analytics.php?start=${startDate}&end=${endDate}&type=${reportType}`);
        const data = await response.json();

        // Создаем книгу Excel
        const wb = XLSX.utils.book_new();
        let worksheetData = [];
        
        // Добавляем заголовок с периодом
        worksheetData.push([`Отчет за период: ${startDate} - ${endDate}`]);
        worksheetData.push([]); // Пустая строка
        
        // Заполняем данные в зависимости от типа отчета
        switch(reportType) {
            case 'occupancy':
                worksheetData.push(["Категория номера", "Загрузка (%)"]);
                data.categories.forEach((category, index) => {
                    worksheetData.push([category, data.occupancy[index]]);
                });
                break;
                
            case 'financial':
                worksheetData.push(["Финансовые показатели", "Значение"]);
                worksheetData.push(["Общий доход", `${data.financial.totalIncome.toLocaleString('ru-RU')} ₽`]);
                worksheetData.push(["Средний чек", `${data.financial.averageCheck.toLocaleString('ru-RU')} ₽`]);
                worksheetData.push(["Загрузка гостиницы", `${data.financial.occupancy}%`]);
                break;
                
            case 'clients':
                worksheetData.push(["Клиентская статистика", "Значение"]);
                worksheetData.push(["Новые клиенты", data.clients.newClients]);
                worksheetData.push(["Постоянные клиенты", `${data.clients.regularClients}%`]);
                worksheetData.push(["Средний срок проживания", `${data.clients.avgStayDays} ${getDayText(data.clients.avgStayDays)}`]);
                break;
        }

        const ws = XLSX.utils.aoa_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(wb, ws, "Отчет");
        XLSX.writeFile(wb, `Отчет_${reportType}_${startDate}_${endDate}.xlsx`);

    } catch (error) {
        console.error('Ошибка экспорта:', error);
        alert('Произошла ошибка при экспорте отчета');
    } finally {
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
    }
}
// Вспомогательная функция форматирования даты
function formatDate2(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}
});