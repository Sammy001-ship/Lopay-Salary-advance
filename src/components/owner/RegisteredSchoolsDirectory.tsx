import React, { useState, useMemo } from 'react';
import { RegisteredSchool } from '../../types';

interface RegisteredSchoolsDirectoryProps {
  schools: RegisteredSchool[];
  activeSchoolId?: string;
  onAddSchool?: (school: RegisteredSchool) => void;
  onSelectSchool?: (school: RegisteredSchool, targetTab?: 'overview' | 'roster') => void;
}

export const RegisteredSchoolsDirectory: React.FC<RegisteredSchoolsDirectoryProps> = ({
  schools,
  activeSchoolId,
  onAddSchool,
  onSelectSchool,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cycleFilter, setCycleFilter] = useState<'all' | '25' | '26' | '27' | '28'>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedDetailSchool, setSelectedDetailSchool] = useState<RegisteredSchool | null>(null);

  // Form state for registering new school
  const [newName, setNewName] = useState<string>('');
  const [newRcNumber, setNewRcNumber] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newProprietor, setNewProprietor] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newFacultyCount, setNewFacultyCount] = useState<number>(25);
  const [newPayrollBudget, setNewPayrollBudget] = useState<string>('10500000');
  const [newPayrollCycleDay, setNewPayrollCycleDay] = useState<number>(28);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered schools
  const filteredSchools = useMemo(() => {
    return schools.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.rcNumber.toLowerCase().includes(q) ||
        s.proprietorName.toLowerCase().includes(q);

      const matchesCycle =
        cycleFilter === 'all' || s.payrollCycleDay.toString() === cycleFilter;

      return matchesSearch && matchesCycle;
    });
  }, [schools, searchQuery, cycleFilter]);

  // Aggregate metrics
  const totalFacultyCount = useMemo(
    () => schools.reduce((acc, s) => acc + s.facultyCount, 0),
    [schools]
  );

  const totalPayrollPool = useMemo(
    () => schools.reduce((acc, s) => acc + (s.monthlyPayrollBudget || s.facultyCount * 420000), 0),
    [schools]
  );

  const totalAdvancesVolume = useMemo(
    () => schools.reduce((acc, s) => acc + (s.advancesThisMonth || 0), 0),
    [schools]
  );

  const handleRegisterSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRcNumber.trim()) {
      alert('Please fill in school name and RC Number.');
      return;
    }

    setIsSubmitting(true);

    const createdSchool: RegisteredSchool = {
      id: `school-${Date.now()}`,
      name: newName.trim(),
      location: newLocation.trim() || 'Lagos, Nigeria',
      rcNumber: newRcNumber.trim().toUpperCase().startsWith('RC-')
        ? newRcNumber.trim().toUpperCase()
        : `RC-${newRcNumber.trim().toUpperCase()}`,
      isRegisteredWithLopay: true,
      payrollCycleDay: Number(newPayrollCycleDay),
      proprietorName: newProprietor.trim() || 'Proprietor & Governing Director',
      facultyCount: Number(newFacultyCount) || 1,
      monthlyPayrollBudget: parseFloat(newPayrollBudget.replace(/,/g, '')) || 5000000,
      contactEmail: newEmail.trim() || `admin@${newName.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu.ng`,
      contactPhone: newPhone.trim() || '+234 800 000 0000',
      joinedDate: 'Today',
      advancesThisMonth: 0,
      advancesCount: 0,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      if (onAddSchool) {
        onAddSchool(createdSchool);
      }
      setShowAddModal(false);
      setToastMessage(`"${createdSchool.name}" registered successfully with Lopay!`);
      setTimeout(() => setToastMessage(null), 4000);

      // Reset form
      setNewName('');
      setNewRcNumber('');
      setNewLocation('');
      setNewProprietor('');
      setNewEmail('');
      setNewPhone('');
      setNewFacultyCount(25);
      setNewPayrollBudget('10500000');
    }, 600);
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-[#6cf8bb]/30 border border-[#006c49]/30 rounded-xl text-xs font-semibold text-[#00714d] flex items-center justify-between gap-2 shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#00714d] hover:opacity-75">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Network Overview Hero Card */}
      <section className="relative overflow-hidden rounded-2xl bg-[#131b2e] text-white p-5 shadow-lg">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#006c49]/25 blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between text-[#7c839b] text-[11px] font-semibold uppercase tracking-wider relative z-10">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6ffbbe] animate-pulse"></span>
            <span>Lopay Education Partner Network</span>
          </span>
          <span className="bg-[#6cf8bb]/20 text-[#6ffbbe] px-2.5 py-0.5 rounded-full font-bold">
            {schools.length} Schools Live
          </span>
        </div>

        <div className="mt-3 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-bold text-white tracking-tight">
              Registered Partner Schools
            </h2>
            <p className="text-xs text-[#d3e4fe] mt-0.5">
              Accredited private institutions participating in zero-liability wage access
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="self-start sm:self-auto px-3.5 py-2 bg-[#006c49] hover:bg-[#005236] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add_business</span>
            <span>Register School</span>
          </button>
        </div>

        {/* 3 Key Network Metrics */}
        <div className="grid grid-cols-3 gap-2.5 mt-4 pt-3.5 border-t border-[#213145] relative z-10">
          <div className="p-2.5 bg-[#d3e4fe]/10 rounded-xl">
            <span className="text-[10px] text-[#7c839b] uppercase font-semibold tracking-wider block">
              Institutions
            </span>
            <span className="text-[18px] font-bold text-white tabular-nums block mt-0.5">
              {schools.length}
            </span>
            <span className="text-[9px] text-[#6ffbbe] mt-0.5 block truncate">Verified schools</span>
          </div>

          <div className="p-2.5 bg-[#d3e4fe]/10 rounded-xl">
            <span className="text-[10px] text-[#7c839b] uppercase font-semibold tracking-wider block">
              Faculty Pool
            </span>
            <span className="text-[18px] font-bold text-white tabular-nums block mt-0.5">
              {totalFacultyCount}
            </span>
            <span className="text-[9px] text-[#d3e4fe] mt-0.5 block truncate">Active teachers</span>
          </div>

          <div className="p-2.5 bg-[#006c49]/30 border border-[#6cf8bb]/30 rounded-xl">
            <span className="text-[10px] text-[#6ffbbe] uppercase font-semibold tracking-wider block">
              Monthly Payroll
            </span>
            <span className="text-[17px] font-bold text-white tabular-nums block mt-0.5">
              ₦{(totalPayrollPool / 1000000).toFixed(1)}M
            </span>
            <span className="text-[9px] text-[#6ffbbe] mt-0.5 block truncate">Combined pool</span>
          </div>
        </div>
      </section>

      {/* Search and Cycle Filter Bar */}
      <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#eff4ff] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#006c49]">domain</span>
            <span className="text-xs font-bold text-[#0b1c30]">
              Registered Institutions Directory ({filteredSchools.length})
            </span>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[#76777d] text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search school name, location, RC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 bg-[#eff4ff] text-xs text-[#0b1c30] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden placeholder:text-[#76777d]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-semibold text-[#76777d] shrink-0 mr-1">
            Payroll Cycle:
          </span>
          <button
            type="button"
            onClick={() => setCycleFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              cycleFilter === 'all'
                ? 'bg-[#006c49] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#dce9ff]'
            }`}
          >
            All Cycles ({schools.length})
          </button>
          <button
            type="button"
            onClick={() => setCycleFilter('25')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              cycleFilter === '25'
                ? 'bg-[#006c49] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#dce9ff]'
            }`}
          >
            25th Monthly
          </button>
          <button
            type="button"
            onClick={() => setCycleFilter('26')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              cycleFilter === '26'
                ? 'bg-[#006c49] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#dce9ff]'
            }`}
          >
            26th Monthly
          </button>
          <button
            type="button"
            onClick={() => setCycleFilter('27')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              cycleFilter === '27'
                ? 'bg-[#006c49] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#dce9ff]'
            }`}
          >
            27th Monthly
          </button>
          <button
            type="button"
            onClick={() => setCycleFilter('28')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              cycleFilter === '28'
                ? 'bg-[#006c49] text-white shadow-xs'
                : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#dce9ff]'
            }`}
          >
            28th Monthly
          </button>
        </div>
      </section>

      {/* Schools Cards List */}
      <div className="space-y-3">
        {filteredSchools.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-[#eff4ff] text-center space-y-2">
            <span className="material-symbols-outlined text-[36px] text-[#76777d]">domain_disabled</span>
            <p className="text-xs font-bold text-[#0b1c30]">No matching schools found</p>
            <p className="text-[11px] text-[#45464d]">Try clearing your search query or cycle filter.</p>
          </div>
        ) : (
          filteredSchools.map((school) => {
            const isSelected = selectedDetailSchool?.id === school.id;
            const payrollFormatted = school.monthlyPayrollBudget
              ? `₦${(school.monthlyPayrollBudget / 1000000).toFixed(2)}M`
              : `₦${((school.facultyCount * 420000) / 1000000).toFixed(2)}M`;

            const advancesFormatted = school.advancesThisMonth
              ? `₦${(school.advancesThisMonth / 1000000).toFixed(2)}M`
              : '₦0.00';

            const isActiveSchool = activeSchoolId === school.id;

            return (
              <div
                key={school.id}
                onClick={() => {
                  setSelectedDetailSchool(school);
                  if (onSelectSchool) {
                    onSelectSchool(school);
                  }
                }}
                className={`bg-white rounded-2xl p-4 sm:p-5 shadow-xs border transition-all duration-200 cursor-pointer ${
                  isActiveSchool
                    ? 'border-[#006c49] ring-2 ring-[#006c49]/30 bg-[#f7fcf9]'
                    : isSelected
                    ? 'border-[#006c49] ring-2 ring-[#006c49]/20'
                    : 'border-[#eff4ff] hover:border-[#d3e4fe] hover:shadow-md'
                }`}
              >
                {/* Header Row: School Name & Verification Pill */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#eff4ff] text-[#006c49] flex items-center justify-center font-bold text-sm shrink-0 border border-[#d3e4fe]">
                      <span className="material-symbols-outlined text-[24px]">school</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-bold text-[#0b1c30] truncate">
                          {school.name}
                        </h3>
                        <span className="material-symbols-outlined text-[16px] text-[#006c49] fill">verified</span>
                        {isActiveSchool && (
                          <span className="px-2 py-0.5 rounded-full bg-[#006c49] text-white text-[9px] font-bold">
                            Active Dashboard
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#45464d] flex items-center gap-1 truncate mt-0.5">
                        <span className="material-symbols-outlined text-[13px] text-[#76777d]">location_on</span>
                        <span>{school.location}</span>
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#6cf8bb]/30 text-[#00714d] text-[10px] font-bold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
                    <span>LOPAY Verified</span>
                  </span>
                </div>

                {/* Institution Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-[#eff4ff]">
                  <div className="p-2 bg-[#eff4ff] rounded-xl">
                    <span className="text-[10px] text-[#45464d] block font-medium">Corporate Registration</span>
                    <span className="text-xs font-bold text-[#0b1c30] block mt-0.5 font-mono">
                      {school.rcNumber}
                    </span>
                  </div>

                  <div className="p-2 bg-[#eff4ff] rounded-xl">
                    <span className="text-[10px] text-[#45464d] block font-medium">Enrolled Faculty</span>
                    <span className="text-xs font-bold text-[#006c49] block mt-0.5">
                      {school.facultyCount} Educators
                    </span>
                  </div>

                  <div className="p-2 bg-[#eff4ff] rounded-xl">
                    <span className="text-[10px] text-[#45464d] block font-medium">Payroll Cycle Day</span>
                    <span className="text-xs font-bold text-[#0b1c30] block mt-0.5">
                      Every {school.payrollCycleDay}th
                    </span>
                  </div>

                  <div className="p-2 bg-[#eff4ff] rounded-xl">
                    <span className="text-[10px] text-[#45464d] block font-medium">Monthly Payroll Pool</span>
                    <span className="text-xs font-bold text-[#0b1c30] block mt-0.5">
                      {payrollFormatted}
                    </span>
                  </div>
                </div>

                {/* Proprietor & Leadership Info */}
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#eff4ff]">
                  <div className="flex items-center gap-1.5 text-[#45464d]">
                    <span className="material-symbols-outlined text-[16px] text-[#006c49]">person</span>
                    <span>
                      Proprietor: <strong className="text-[#0b1c30]">{school.proprietorName}</strong>
                    </span>
                  </div>

                  {school.advancesThisMonth ? (
                    <span className="text-[11px] text-[#006c49] font-semibold bg-[#6cf8bb]/20 px-2 py-0.5 rounded-full">
                      Advances: {advancesFormatted} ({school.advancesCount || 10} claims)
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#76777d]">Zero employer liability</span>
                  )}
                </div>

                {/* Action Bar */}
                <div className="mt-3 pt-2.5 border-t border-[#eff4ff] flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    {school.contactEmail && (
                      <a
                        href={`mailto:${school.contactEmail}`}
                        className="text-[11px] text-[#45464d] hover:text-[#006c49] flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#eff4ff] transition-colors"
                        title={school.contactEmail}
                      >
                        <span className="material-symbols-outlined text-[14px]">mail</span>
                        <span className="hidden sm:inline">{school.contactEmail}</span>
                      </a>
                    )}
                    {school.contactPhone && (
                      <a
                        href={`tel:${school.contactPhone}`}
                        className="text-[11px] text-[#45464d] hover:text-[#006c49] flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#eff4ff] transition-colors"
                        title={school.contactPhone}
                      >
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span className="hidden sm:inline">{school.contactPhone}</span>
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectSchool) {
                        onSelectSchool(school, 'roster');
                      }
                      setSelectedDetailSchool(school);
                    }}
                    className="px-3 py-1.5 bg-[#006c49] hover:bg-[#005236] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <span>Manage {school.name.split(' ')[0]}</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dedicated School Details Modal */}
      {selectedDetailSchool && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedDetailSchool(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#d3e4fe] space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#eff4ff]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#006c49] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">school</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#006c49] font-bold uppercase tracking-wider">
                      Registered Partner Institution
                    </span>
                    <span className="material-symbols-outlined text-[15px] text-[#006c49] fill">verified</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0b1c30] tracking-tight">
                    {selectedDetailSchool.name}
                  </h3>
                  <p className="text-xs text-[#45464d] flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px] text-[#76777d]">location_on</span>
                    <span>{selectedDetailSchool.location}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetailSchool(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#76777d] hover:bg-[#eff4ff]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* School Profile Specs Grid */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-[#eff4ff] rounded-xl">
                  <span className="text-[10px] text-[#45464d] block font-medium">Corporate Registration</span>
                  <span className="text-sm font-bold text-[#0b1c30] block mt-0.5 font-mono">
                    {selectedDetailSchool.rcNumber}
                  </span>
                  <span className="text-[10px] text-[#006c49] font-semibold mt-0.5 block">CAC Verified</span>
                </div>

                <div className="p-3 bg-[#eff4ff] rounded-xl">
                  <span className="text-[10px] text-[#45464d] block font-medium">Enrolled Faculty Headcount</span>
                  <span className="text-sm font-bold text-[#006c49] block mt-0.5">
                    {selectedDetailSchool.facultyCount} Educators
                  </span>
                  <span className="text-[10px] text-[#45464d] mt-0.5 block">0% APR benefit active</span>
                </div>

                <div className="p-3 bg-[#eff4ff] rounded-xl">
                  <span className="text-[10px] text-[#45464d] block font-medium">Monthly Payroll Budget</span>
                  <span className="text-sm font-bold text-[#0b1c30] block mt-0.5 tabular-nums">
                    ₦{(selectedDetailSchool.monthlyPayrollBudget || 14000000).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-[#45464d] mt-0.5 block">Automated deductions</span>
                </div>

                <div className="p-3 bg-[#eff4ff] rounded-xl">
                  <span className="text-[10px] text-[#45464d] block font-medium">Payroll Settlement Cycle</span>
                  <span className="text-sm font-bold text-[#0b1c30] block mt-0.5">
                    Every {selectedDetailSchool.payrollCycleDay}th of month
                  </span>
                  <span className="text-[10px] text-[#006c49] font-semibold mt-0.5 block">Automated Sync</span>
                </div>
              </div>

              {/* Leadership & Contacts */}
              <div className="p-3.5 bg-[#f8f9ff] rounded-2xl border border-[#d3e4fe] space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
                  <span className="text-[#45464d] font-medium">Governing Proprietor:</span>
                  <span className="font-bold text-[#0b1c30]">{selectedDetailSchool.proprietorName}</span>
                </div>

                {selectedDetailSchool.contactEmail && (
                  <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
                    <span className="text-[#45464d] font-medium">Official Admin Email:</span>
                    <a
                      href={`mailto:${selectedDetailSchool.contactEmail}`}
                      className="font-semibold text-[#006c49] hover:underline"
                    >
                      {selectedDetailSchool.contactEmail}
                    </a>
                  </div>
                )}

                {selectedDetailSchool.contactPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#45464d] font-medium">Direct Telephone:</span>
                    <a
                      href={`tel:${selectedDetailSchool.contactPhone}`}
                      className="font-semibold text-[#006c49] hover:underline font-mono"
                    >
                      {selectedDetailSchool.contactPhone}
                    </a>
                  </div>
                )}
              </div>

              {/* Lopay Guarantee Note */}
              <div className="p-3 bg-[#eff4ff] rounded-xl text-[11px] text-[#45464d] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006c49]">verified</span>
                <span>
                  {selectedDetailSchool.name} is accredited on Lopay. Teachers can access accrued earned wages with zero employer liability.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onSelectSchool) {
                    onSelectSchool(selectedDetailSchool, 'overview');
                  }
                  setSelectedDetailSchool(null);
                }}
                className="w-full sm:flex-1 py-2.5 px-3 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006c49] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">dashboard</span>
                <span>Switch Dashboard to {selectedDetailSchool.name.split(' ')[0]}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onSelectSchool) {
                    onSelectSchool(selectedDetailSchool, 'roster');
                  }
                  setSelectedDetailSchool(null);
                }}
                className="w-full sm:flex-1 py-2.5 px-3 bg-[#006c49] hover:bg-[#005236] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">groups</span>
                <span>Manage {selectedDetailSchool.name.split(' ')[0]} Faculty</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#d3e4fe] space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#6cf8bb]/30 text-[#006c49] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">add_business</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0b1c30]">Register New Partner School</h3>
                  <p className="text-[11px] text-[#45464d]">Enroll school into Lopay 0% APR employer network</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#76777d] hover:bg-[#eff4ff]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleRegisterSchool} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#0b1c30]">School / Institution Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vivian Fowler Memorial College"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-10 bg-[#eff4ff] rounded-xl px-3 text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#0b1c30]">CAC / RC Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RC-1938491"
                    value={newRcNumber}
                    onChange={(e) => setNewRcNumber(e.target.value)}
                    className="w-full h-10 bg-[#eff4ff] rounded-xl px-3 text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#0b1c30]">Campus Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ikeja GRA, Lagos"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full h-10 bg-[#eff4ff] rounded-xl px-3 text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#0b1c30]">Proprietor / Director Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Mrs. Funke Fowler"
                    value={newProprietor}
                    onChange={(e) => setNewProprietor(e.target.value)}
                    className="w-full h-10 bg-[#eff4ff] rounded-xl px-3 text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#0b1c30]">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. bursary@vivianfowler.edu.ng"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full h-10 bg-[#eff4ff] rounded-xl px-3 text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#0b1c30]">Faculty Count</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newFacultyCount}
                    onChange={(e) => setNewFacultyCount(Number(e.target.value))}
                    className="w-full h-10 bg-[#eff4ff] rounded-xl px-3 text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#0b1c30]">Cycle Day</label>
                  <select
                    value={newPayrollCycleDay}
                    onChange={(e) => setNewPayrollCycleDay(Number(e.target.value))}
                    className="w-full h-10 bg-[#eff4ff] rounded-xl px-3 text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden"
                  >
                    <option value={25}>25th of month</option>
                    <option value={26}>26th of month</option>
                    <option value={27}>27th of month</option>
                    <option value={28}>28th of month</option>
                    <option value={29}>29th of month</option>
                    <option value={30}>30th of month</option>
                    <option value={31}>31st (Month-end)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#0b1c30]">Monthly Payroll (₦)</label>
                  <input
                    type="text"
                    required
                    placeholder="10500000"
                    value={newPayrollBudget}
                    onChange={(e) => setNewPayrollBudget(e.target.value)}
                    className="w-full h-10 bg-[#eff4ff] rounded-xl px-3 text-[#0b1c30] focus:bg-white focus:ring-2 focus:ring-[#006c49] outline-hidden tabular-nums font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#eff4ff] rounded-xl text-[11px] text-[#45464d] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006c49]">verified_user</span>
                <span>
                  By registering, the institution confirms payroll reconciliation integration under Lopay Terms.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#45464d] hover:bg-[#eff4ff] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#006c49] hover:bg-[#005236] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Save &amp; Verify School</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
