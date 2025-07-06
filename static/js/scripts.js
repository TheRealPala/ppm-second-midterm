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
        document.getElementById('login-status').textContent = `Logged in as: ${select.options[select.selectedIndex].value}`;
        document.getElementById('login-status').classList.add('border-success');
        document.getElementById('login-status').classList.remove('border-danger');
    }
}

function saveTokens(access, refresh) {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
}

function clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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