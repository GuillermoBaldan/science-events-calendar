document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.querySelector('.calendar');
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let events = [];

    // Cargar efemérides desde el archivo JSON
    fetch('./Data/data.json')
        .then(response => response.json())
        .then(data => {
            events = data;
            updateCalendar();
        })
        .catch(error => console.error('Error al cargar los eventos:', error));

    function updateCalendar() {
        // Limpiar el calendario
        calendarElement.innerHTML = '';

        // Mostrar el mes actual
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        // Crear encabezados de días de la semana
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day', 'header');
            dayElement.textContent = day;
            calendarElement.appendChild(dayElement);
        });

        // Obtener el primer día del mes y el número de días en el mes
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Crear espacios vacíos para los días anteriores al primer día del mes
        for (let i = 0; i < firstDay; i++) {
            const emptyElement = document.createElement('div');
            emptyElement.classList.add('day');
            calendarElement.appendChild(emptyElement);
        }

        // Crear los días del mes
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = i;

            // Verificar si hay eventos para este día
            const dayEvents = events.filter(event => event.day === i && event.month === currentMonth + 1);
            if (dayEvents.length > 0) {
                dayEvents.forEach(event => {
                    const eventElement = document.createElement('div');
                    eventElement.classList.add('event');
                    eventElement.textContent = `${event.title} (${event.year})`;
                    dayElement.appendChild(eventElement);
                });
            }

            calendarElement.appendChild(dayElement);
        }
    }

    // Manejar navegación entre meses
    prevMonthButton.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });
});
