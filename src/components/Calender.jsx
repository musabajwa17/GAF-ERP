import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PlantingCalendar = ({ plantings }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const getCellStatus = (date, planting) => {
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);

    const sowingStart = new Date(planting.seedStarted);
    sowingStart.setHours(0, 0, 0, 0);

    const sowingEnd = new Date(sowingStart);
    sowingEnd.setDate(sowingEnd.getDate() + 7);

    const plantedDate = new Date(planting.planted);
    plantedDate.setHours(0, 0, 0, 0);

    const harvestStart = new Date(planting.plannedHarvest);
    harvestStart.setHours(0, 0, 0, 0);

    const harvestEnd = new Date(harvestStart);
    harvestEnd.setDate(harvestEnd.getDate() + (planting.harvestWindowMax - planting.harvestWindowMin || 5));

    // Harvest window period
    if (currentDate >= harvestStart && currentDate <= harvestEnd) {
      return planting.harvested ? 'harvest-done' : 'harvest-pending';
    }

    if (currentDate >= sowingStart && currentDate < sowingEnd) {
      return 'sowing';
    }

    if (currentDate >= sowingEnd && currentDate < harvestStart) {
      return 'growing';
    }

    return null;
  };

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayPlantings = plantings.filter(p => getCellStatus(date, p));
      
      days.push({
        day,
        date,
        plantings: dayPlantings,
        status: dayPlantings.length > 0 ? getCellStatus(date, dayPlantings[0]) : null
      });
    }

    return days;
  }, [currentMonth, currentYear, plantings]);

  const getStatusStyles = (status) => {
    const styles = {
      sowing: 'bg-amber-100 border-amber-300 text-slate-900',
      growing: 'bg-emerald-600 border-emerald-700 text-white',
      'harvest-pending': 'bg-orange-500 border-orange-600 text-white',
      'harvest-done': 'bg-slate-800 border-slate-900 text-white'
    };
    return styles[status] || 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50';
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const statusLegend = [
    { key: 'sowing', label: 'Sowing (7 days)', color: 'bg-amber-100 border border-amber-300' },
    { key: 'growing', label: 'Growing', color: 'bg-emerald-600' },
    { key: 'harvest-pending', label: 'Harvest Window (Pending)', color: 'bg-orange-500' },
    { key: 'harvest-done', label: 'Harvest Window (Done)', color: 'bg-slate-800' }
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-slate-100 rounded-lg transition"
          title="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 min-w-48 text-center">
          {monthNames[currentMonth]} {currentYear}
        </h3>

        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-slate-100 rounded-lg transition"
          title="Next month"
        >
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className="text-center font-semibold text-slate-600 py-2 text-xs uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {calendarDays.map((dayData, idx) => (
          <div
            key={`day-${idx}`}
            className={`h-20 rounded-lg border-2 p-2 text-sm transition-all ${
              dayData === null
                ? 'bg-slate-50 border-slate-100'
                : `border ${getStatusStyles(dayData.status)}`
            }`}
          >
            {dayData && (
              <>
                <div className="font-bold text-xs">{dayData.day}</div>
                {dayData.plantings.length > 0 && (
                  <div className="text-xs truncate mt-1 opacity-90 font-medium">
                    {dayData.plantings[0].crop.type}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <p className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">Legend</p>
        <div className="flex gap-4 flex-wrap">
          {statusLegend.map(item => (
            <div key={item.key} className="flex items-center gap-2 text-sm">
              <div className={`w-4 h-4 rounded ${item.color}`}></div>
              <span className="text-slate-700 text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {plantings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500 text-sm">No plantings to display</p>
        </div>
      )}
    </div>
  );
};

export default PlantingCalendar;