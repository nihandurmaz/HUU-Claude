import { useState, useMemo } from 'react';
import { FileText, MoreVertical, ChevronUp, ChevronDown, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { applicants, stagePillColors } from '../data/applicants';
import { useApp } from '../context/AppContext';
import Avatar from './Avatar';

const PAGE_SIZE = 10;

function TypeBadge({ type }) {
  const isHost = type === 'Host';
  return (
    <span style={{
      backgroundColor: isHost ? '#F3E8FF' : '#E7F1FD',
      color: isHost ? '#7C3AED' : '#0066B8',
      padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500
    }}>{type}</span>
  );
}

function StagePill({ status, stage }) {
  const colors = stagePillColors[stage] || { bg: '#F3F4F6', text: '#6B7280' };
  return (
    <span style={{
      backgroundColor: colors.bg,
      color: colors.text,
      padding: '4px 12px',
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      display: 'inline-block'
    }}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  const { selectApplicant, showToast, intakeStates } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState('demoOrder');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let rows = applicants.map(a => ({
      ...a,
      // reflect denied state in status
      status: intakeStates[a.id] === 'denied' ? 'Denied' : a.status
    }));
    if (activeFilter !== 'All') rows = rows.filter(a => a.type === activeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(a => a.name.toLowerCase().includes(q));
    }
    rows.sort((a, b) => {
      let av = a[sortCol] ?? '';
      let bv = b[sortCol] ?? '';
      if (sortCol === 'updated') {
        av = new Date(av);
        bv = new Date(bv);
      } else if (sortCol === 'demoOrder') {
        av = Number(av);
        bv = Number(bv);
      } else {
        av = String(av).toLowerCase();
        bv = String(bv).toLowerCase();
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return rows;
  }, [activeFilter, search, sortCol, sortDir, intakeStates]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <ChevronDown size={12} style={{ color: '#9CA3AF' }} />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} style={{ color: '#0066B8' }} />
      : <ChevronDown size={12} style={{ color: '#0066B8' }} />;
  };

  const ColHeader = ({ col, label }) => (
    <th
      onClick={() => handleSort(col)}
      style={{ padding: '16px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none', borderBottom: '1px solid #E5E7EB', letterSpacing: '0.5px', textTransform: 'uppercase' }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {label} <SortIcon col={col} />
      </span>
    </th>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1F1F1', padding: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#242424' }}>Dashboard</h2>
        <button
          onClick={() => showToast('Invite flow coming soon', 'info')}
          style={{ backgroundColor: '#242424', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          + Invite New Guest
        </button>
      </div>

      {/* Card */}
      <div style={{ backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        {/* Tabs + Toolbar */}
        <div style={{ padding: '16px 20px 0', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', gap: 24, marginBottom: 0 }}>
            {['All', 'Guest', 'Host'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveFilter(tab); setPage(1); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '8px 2px', fontSize: 14, fontWeight: activeFilter === tab ? 600 : 400,
                  color: activeFilter === tab ? '#0066B8' : '#7C7C7C',
                  borderBottom: activeFilter === tab ? '2px solid #0066B8' : '2px solid transparent',
                  marginBottom: -1
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '14px 20px', display: 'flex', gap: 12, alignItems: 'center', borderBottom: '1px solid #E5E7EB' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 14px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
            <SlidersHorizontal size={14} /> Filter
          </button>
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name..."
              style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, border: '1px solid #E5E7EB', borderRadius: 6, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', padding: '0 24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA' }}>
                <ColHeader col="name" label="NAME" />
                <ColHeader col="type" label="TYPE" />
                <ColHeader col="stage" label="STAGE" />
                <ColHeader col="status" label="STATUS" />
                <ColHeader col="coordinator" label="COORDINATOR" />
                <ColHeader col="updated" label="UPDATED" />
                <th style={{ padding: '16px 16px', borderBottom: '1px solid #E5E7EB' }}></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(applicant => (
                <tr
                  key={applicant.id}
                  style={{ borderBottom: '1px solid #E5E7EB', minHeight: 56 }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                >
                  <td style={{ padding: '16px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={applicant.initials} color={applicant.avatarColor} size={32} />
                      <button
                        onClick={() => selectApplicant(applicant.id)}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#242424', fontWeight: 500, fontSize: 14, padding: 0, textDecoration: 'none' }}
                      >
                        {applicant.name}
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '16px 16px' }}><TypeBadge type={applicant.type} /></td>
                  <td style={{ padding: '16px 16px', fontSize: 13, color: '#242424' }}>{applicant.stage}</td>
                  <td style={{ padding: '16px 16px' }}><StagePill status={applicant.status} stage={applicant.stage} /></td>
                  <td style={{ padding: '16px 16px', fontSize: 13, color: '#242424' }}>{applicant.coordinator}</td>
                  <td style={{ padding: '16px 16px', fontSize: 13, color: '#7C7C7C' }}>{applicant.updated}</td>
                  <td style={{ padding: '16px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
                      <button
                        onClick={() => showToast('Document view coming soon', 'info')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C7C7C', display: 'flex', padding: 4 }}
                      >
                        <FileText size={16} />
                      </button>
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={() => setOpenMenu(openMenu === applicant.id ? null : applicant.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C7C7C', display: 'flex', padding: 4 }}
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openMenu === applicant.id && (
                          <div
                            style={{
                              position: 'absolute', right: 0, top: '100%', backgroundColor: '#fff',
                              border: '1px solid #E5E7EB', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                              zIndex: 100, minWidth: 140
                            }}
                          >
                            <button
                              onClick={() => { selectApplicant(applicant.id); setOpenMenu(null); }}
                              style={{ width: '100%', textAlign: 'left', padding: '9px 14px', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', color: '#242424' }}
                              onMouseEnter={e => e.target.style.backgroundColor = '#F3F4F6'}
                              onMouseLeave={e => e.target.style.backgroundColor = ''}
                            >
                              View Profile
                            </button>
                            <button
                              onClick={() => { selectApplicant(applicant.id); setOpenMenu(null); }}
                              style={{ width: '100%', textAlign: 'left', padding: '9px 14px', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', color: '#242424' }}
                              onMouseEnter={e => e.target.style.backgroundColor = '#F3F4F6'}
                              onMouseLeave={e => e.target.style.backgroundColor = ''}
                            >
                              Add Note
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '32px 16px', textAlign: 'center', color: '#7C7C7C', fontSize: 14 }}>
                    No applicants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '6px 10px', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#9CA3AF' : '#242424', display: 'flex' }}
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                border: '1px solid #E5E7EB', borderRadius: 6, padding: '6px 12px',
                background: page === p ? '#0066B8' : '#fff',
                color: page === p ? '#fff' : '#242424',
                fontWeight: page === p ? 600 : 400, cursor: 'pointer', fontSize: 13
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '6px 10px', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#9CA3AF' : '#242424', display: 'flex' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Close dropdown on outside click */}
      {openMenu && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50 }}
          onClick={() => setOpenMenu(null)}
        />
      )}
    </div>
  );
}
