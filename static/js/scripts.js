const users = {
    user1: { username: 'ale', password: 'pala' },
    user2: { username: 'user2', password: 'password2' },
    staff: { username: 'root', password: 'root' }
};

const api = axios.create({
    baseURL: '/api',
});

// Carico token da localStorage (se presente)
function loadTokens() {
    const token = localStorage.getItem('accessToken');
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const select = document.getElementById('user-select')
        let userDisplay = select.options[localStorage.getItem('indexElement')].value;
        if (userDisplay === '') {
            userDisplay = 'Anonymous'
        }
        document.getElementById('login-status').textContent = `Logged in as: ${userDisplay}`;
        document.getElementById('login-status').classList.add('border-success');
        document.getElementById('login-status').classList.remove('border-danger');
    }
}

function saveTokens(access, refresh) {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    const select = document.getElementById('user-select');
    localStorage.setItem('indexElement', select.selectedIndex);
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
}

function clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('indexElement')
    delete api.defaults.headers.common['Authorization'];
}

// Funzione di login via API
async function login(username, password) {
    try {
        const res = await api.post('/token/', { username, password });
        saveTokens(res.data.access, res.data.refresh);
        document.getElementById('login-status').textContent = `Logged in as: ${username}`;
        document.getElementById('login-status').classList.add('border-success');
        document.getElementById('login-status').classList.remove('border-danger');
    } catch (e) {
        document.getElementById('login-status').textContent = 'Login failed';
        document.getElementById('login-status').classList.add('border-danger');
        document.getElementById('login-status').classList.remove('border-success');

        clearTokens();
    }
}

function display(outputId, data) {
    document.getElementById(outputId).textContent = JSON.stringify(data, null, 2);
}
function clearOutput(container) {
    document.getElementById(container).textContent='';
}

function errorToString(error){
    if (error?.response.data['non_field_errors']) {
        let message = error?.response.data['non_field_errors'][0]
        return `Errore ${error.status}: ${message}`
    }

    console.log(error);
    return `Errore ${error.status}: ${error.response ? error.response.data.detail ? error.response.data.detail : error.response.data[0]  : error.message}`
}

// EVENTS
async function getEvents() {
    try {
        const res = await api.get('/events/');
        display('events-output', res.data);
    } catch (error) {
        console.error("Errore nella getAllEvents:", error);
        display('events-output', errorToString(error));
    }
}

async function getEventById() {
    try {
        const id = document.getElementById('event-id').value;
        const res = await api.get(`/events/${id}/`);
        display('events-output', res.data);
    } catch (error) {
        console.error("Errore nella getEventById:", error);
        display('events-output', errorToString(error));
    }
}

async function getAvailableEvents() {
    try {
        const res = await api.get('/events/availables/');
        display('events-output', res.data);
    } catch (error) {
        console.error("Errore nella getAvailableEvents:", error);
        display('events-output', errorToString(error));
    }

}

async function addNewEvent() {
    try {
        const title = document.getElementById('event-title-post').value;
        const location = document.getElementById('event-location-post').value;
        const date = document.getElementById('event-date-post').value;
        const available_tickets = parseInt(document.getElementById('event-tickets-post').value);
        const res = await api.post('/events/', { title, location, date, available_tickets });
        display('events-output', res.data);
    } catch (error) {
        console.error("Errore nella createEvents:", error);
        display('events-output', errorToString(error));
    }
}

async function patchEvent() {
    try {
        const id = parseInt(document.getElementById('event-id-patch').value);
        const title = document.getElementById('event-title-patch').value;
        const location = document.getElementById('event-location-patch').value;
        const date = document.getElementById('event-date-patch').value;
        const available_tickets = parseInt(document.getElementById('event-tickets-patch').value);
        if (!id) {
            display('events-output', 'ID is required for patching an event');
            return;
        }
        let payload = {};
        if (title) {
            payload['title'] = title;
        }
        if (location) {
            payload['location'] = location;
        }
        if (date) {
            payload['date'] = date;
        }
        if (available_tickets) {
            payload['available_tickets'] = available_tickets;
        }
        if (Object.keys(payload).length === 0) {
            display('events-output', 'No fields to update');
            return;
        }
        const res = await api.patch(`/events/${id}/`, payload);
        display('events-output', res.data);
    } catch (error) {
        console.error("Errore nella createEvents:", error);
        display('events-output', errorToString(error));
    }
}

async function deleteEvent() {
    try {
        const id = parseInt(document.getElementById('event-id-delete').value);
        if (!id) {
            display('events-output', 'ID is required for deleting an event');
            return;
        }
        const res = await api.delete(`/events/${id}/`);
        display('events-output', res.data);
    } catch (error) {
        console.error("Errore nella deleteEvent:", error);
        display('events-output', errorToString(error));
    }
}
// RESERVATION
async function getReservations() {
    try {
        const res = await api.get('/reservations/');
        display('reservations-output', res.data);
    } catch (error) {
        console.error("Errore nella getReservations:", error);
        display('reservations-output', errorToString(error));
    }
}

async function getReservationById() {
    try {
        const id = document.getElementById('reservation-id').value;
        const res = await api.get(`/reservations/${id}/`);
        display('reservations-output', res.data);
    } catch (error) {
        console.error("Errore nella getReservationById:", error);
        display('reservations-output', errorToString(error));
    }
}

async function createReservation() {
    try {
        const event = parseInt(document.getElementById('res-event-id').value);
        const tickets = parseInt(document.getElementById('res-tickets').value);
        const res = await api.post('/reservations/', { event, tickets });
        display('reservations-output', res.data);
    } catch (error) {
        console.error("Errore nella createReservation:", error);
        display('reservations-output', errorToString(error));
    }
}

async function payReservation() {
    try {
        const id = document.getElementById('res-pay-id').value;
        const res = await api.post(`/reservations/${id}/pay/`);
        display('reservations-output', res.data);
    } catch (error) {
        console.error("Errore nella createReservation:", error);
        display('reservations-output', errorToString(error));
    }
}

async function updateReservation() {
    try {
        const id = document.getElementById('res-update-id').value;
        const tickets = parseInt(document.getElementById('res-update-tickets').value);
        const res = await api.patch(`/reservations/${id}/`, { tickets });
        display('reservations-output', res.data);
    } catch (error) {
        console.error("Errore nella updateReservation:", error);
        display('reservations-output', errorToString(error));
    }
}
async function deleteReservation() {
    try {
        const id = document.getElementById('res-delete-id').value;
        const res = await api.delete(`/reservations/${id}/`);
        display('reservations-output', res.data);
    } catch (error) {
        console.error("Errore nella deleteReservation:", error);
        display('reservations-output', errorToString(error));
    }
}
//USERS
// USERS
async function getUsers() {
    try {
        const res = await api.get('/users/');
        display('users-output', res.data);
    } catch (error) {
        console.error("Errore nella getUsers:", error);
        display('users-output', errorToString(error));
    }
}

async function getUserById() {
    try {
        const id = document.getElementById('user-id').value;
        const res = await api.get(`/users/${id}/`);
        display('users-output', res.data);
    } catch (error) {
        console.error("Errore nella getUserById:", error);
        display('users-output', errorToString(error));
    }
}

async function createUser() {
    try {
        const username = document.getElementById('user-username').value;
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;
        const birth_date = document.getElementById('user-birth').value;

        const res = await api.post('/users/', { username, email, password, birth_date });
        display('users-output', res.data);
    } catch (error) {
        console.error("Errore nella createUser:", error);
        display('users-output', errorToString(error));
    }
}

async function patchUser() {
    try {
        const id = parseInt(document.getElementById('user-id-patch').value);
        const email = document.getElementById('user-email-patch').value;
        const password = document.getElementById('user-password-patch').value;
        const birth_date = document.getElementById('user-birth-patch').value;

        if (!id) {
            display('users-output', 'ID is required for patching a user');
            return;
        }

        let payload = {};
        if (email) payload['email'] = email;
        if (password) payload['password'] = password;
        if (birth_date) payload['birth_date'] = birth_date;

        if (Object.keys(payload).length === 0) {
            display('users-output', 'No fields to update');
            return;
        }

        const res = await api.patch(`/users/${id}/`, payload);
        display('users-output', res.data);
    } catch (error) {
        console.error("Errore nella patchUser:", error);
        display('users-output', errorToString(error));
    }
}

async function deleteUser() {
    try {
        const id = parseInt(document.getElementById('user-id-delete').value);
        if (!id) {
            display('users-output', 'ID is required for deleting a user');
            return;
        }
        const res = await api.delete(`/users/${id}/`);
        display('users-output', res.data || `User ${id} deleted`);
    } catch (error) {
        console.error("Errore nella deleteUser:", error);
        display('users-output', errorToString(error));
    }
}

document.getElementById('user-select').addEventListener('change', e => {
    const val = e.target.value;
    if (!val) {
        clearTokens();
        document.getElementById('login-status').textContent = 'Anonymous';
        return;
    }
    const user = users[val];
    login(user.username, user.password);
});

api.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config;
        if (err.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const res = await api.post('/token/refresh/', { refresh: refreshToken });
                    saveTokens(res.data.access, refreshToken);
                    originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    clearTokens();
                    document.getElementById('login-status').textContent = 'Session expired, please login again';
                    document.getElementById('login-status').classList.add('border-danger');
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(err);
    }
);

document.getElementById('login-status').textContent = 'Anonymous';
loadTokens();