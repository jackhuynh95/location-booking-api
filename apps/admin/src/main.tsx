import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Building2,
  CalendarCheck,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  RefreshCw,
  Save,
  Search,
} from 'lucide-react';
import './styles.css';

type LocationNode = {
  id: string;
  building: string;
  name: string;
  number: string;
  department: string | null;
  capacity: number | null;
  openTime: string | null;
  isBookable: boolean;
  parentId: string | null;
  children?: LocationNode[];
};

type BookingResponse = {
  id: string;
  locationId: string;
  department: string;
  attendeeCount: number;
  startsAt: string;
  endsAt: string;
  createdAt: string;
};

type ApiError = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

type LoadState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: T };

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

const apiUrl = (path: string) => `${apiBaseUrl}${path}`;

const toErrorMessage = (payload: unknown, fallback: string) => {
  if (payload && typeof payload === 'object') {
    const error = payload as ApiError;
    if (Array.isArray(error.message)) {
      return error.message.join(', ');
    }
    if (typeof error.message === 'string') {
      return error.message;
    }
    if (typeof error.error === 'string') {
      return error.error;
    }
  }
  return fallback;
};

const requestJson = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(apiUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(toErrorMessage(payload, `Request failed: ${response.status}`));
  }

  return payload as T;
};

const flattenLocations = (nodes: LocationNode[]): LocationNode[] =>
  nodes.flatMap((node) => [node, ...flattenLocations(node.children ?? [])]);

const App = () => {
  const [locations, setLocations] = React.useState<LoadState<LocationNode[]>>({
    status: 'loading',
  });
  const [selectedLocationId, setSelectedLocationId] = React.useState('');
  const [locationResult, setLocationResult] = React.useState<string | null>(null);
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const [bookingResult, setBookingResult] = React.useState<BookingResponse | null>(null);
  const [bookingError, setBookingError] = React.useState<string | null>(null);

  const loadLocations = React.useCallback(async () => {
    setLocations({ status: 'loading' });
    try {
      const tree = await requestJson<LocationNode[]>('/locations/tree');
      setLocations({ status: 'ready', data: tree });
      const firstBookable = flattenLocations(tree).find((location) => location.isBookable);
      setSelectedLocationId((current) => current || firstBookable?.id || '');
    } catch (error) {
      setLocations({
        status: 'error',
        message: error instanceof Error ? error.message : 'Could not load locations',
      });
    }
  }, []);

  React.useEffect(() => {
    void loadLocations();
  }, [loadLocations]);

  const flatLocations =
    locations.status === 'ready' ? flattenLocations(locations.data) : [];
  const bookableLocations = flatLocations.filter((location) => location.isBookable);

  const submitLocation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocationError(null);
    setLocationResult(null);
    const data = new FormData(event.currentTarget);
    const updateId = String(data.get('updateId') ?? '');
    const capacityValue = String(data.get('capacity') ?? '').trim();
    const payload = {
      building: String(data.get('building') ?? '').trim(),
      name: String(data.get('name') ?? '').trim(),
      number: String(data.get('number') ?? '').trim(),
      department: String(data.get('department') ?? '').trim() || undefined,
      capacity: capacityValue ? Number(capacityValue) : undefined,
      openTime: String(data.get('openTime') ?? '').trim() || undefined,
      isBookable: data.get('isBookable') === 'on',
      parentId: String(data.get('parentId') ?? '') || undefined,
    };

    try {
      const saved = await requestJson<LocationNode>(
        updateId ? `/locations/${updateId}` : '/locations',
        {
          method: updateId ? 'PATCH' : 'POST',
          body: JSON.stringify(payload),
        },
      );
      setLocationResult(`${updateId ? 'Updated' : 'Created'} ${saved.number}`);
      event.currentTarget.reset();
      await loadLocations();
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : 'Could not save location');
    }
  };

  const submitBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookingError(null);
    setBookingResult(null);
    const data = new FormData(event.currentTarget);
    const payload = {
      locationId: String(data.get('locationId') ?? ''),
      department: String(data.get('department') ?? '').trim(),
      attendeeCount: Number(data.get('attendeeCount') ?? 0),
      startsAt: String(data.get('startsAt') ?? ''),
      endsAt: String(data.get('endsAt') ?? ''),
    };

    try {
      const created = await requestJson<BookingResponse>('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setBookingResult(created);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Could not create booking');
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Reviewer admin</p>
          <h1>Location Booking API</h1>
        </div>
        <button className="icon-button" type="button" onClick={() => void loadLocations()}>
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </header>

      <section className="status-band">
        <Metric label="Locations" value={flatLocations.length} />
        <Metric label="Bookable rooms" value={bookableLocations.length} />
        <Metric label="Buildings" value={new Set(flatLocations.map((item) => item.building)).size} />
      </section>

      <section className="workspace">
        <div className="tree-panel">
          <div className="panel-heading">
            <Building2 size={20} />
            <h2>Location hierarchy</h2>
          </div>
          <LocationTree state={locations} />
        </div>

        <div className="side-stack">
          <form className="form-panel" onSubmit={submitLocation}>
            <div className="panel-heading">
              <Save size={20} />
              <h2>Create or update location</h2>
            </div>
            <div className="form-grid">
              <label className="wide">
                Update target
                <select name="updateId">
                  <option value="">Create new location</option>
                  {flatLocations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.number} - {location.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Building
                <input name="building" required placeholder="A" />
              </label>
              <label>
                Number
                <input name="number" required placeholder="A-01-04" />
              </label>
              <label className="wide">
                Name
                <input name="name" required placeholder="Focus Room" />
              </label>
              <label>
                Department
                <input name="department" placeholder="EFM" />
              </label>
              <label>
                Capacity
                <input name="capacity" type="number" min="1" placeholder="8" />
              </label>
              <label className="wide">
                Open time
                <input name="openTime" placeholder="Mon to Fri (9AM to 6PM)" />
              </label>
              <label className="wide">
                Parent
                <select name="parentId">
                  <option value="">None</option>
                  {flatLocations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.number} - {location.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="toggle wide">
                <input name="isBookable" type="checkbox" />
                Bookable room
              </label>
            </div>
            <button className="primary-button" type="submit">
              <Save size={18} />
              <span>Save location</span>
            </button>
            <InlineResult message={locationResult} error={locationError} />
          </form>

          <form className="form-panel" onSubmit={submitBooking}>
            <div className="panel-heading">
              <CalendarCheck size={20} />
              <h2>Booking validation</h2>
            </div>
            <div className="form-grid">
              <label className="wide">
                Room
                <select
                  name="locationId"
                  required
                  value={selectedLocationId}
                  onChange={(event) => setSelectedLocationId(event.target.value)}
                >
                  <option value="">Select bookable room</option>
                  {bookableLocations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.number} - {location.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Department
                <input name="department" required placeholder="EFM" />
              </label>
              <label>
                Attendees
                <input name="attendeeCount" required type="number" min="1" defaultValue="2" />
              </label>
              <label>
                Starts
                <input name="startsAt" required type="datetime-local" />
              </label>
              <label>
                Ends
                <input name="endsAt" required type="datetime-local" />
              </label>
            </div>
            <button className="primary-button" type="submit">
              <CalendarCheck size={18} />
              <span>Validate booking</span>
            </button>
            <InlineResult
              message={bookingResult ? `Booking accepted: ${bookingResult.id}` : null}
              error={bookingError}
            />
          </form>
        </div>
      </section>
    </main>
  );
};

const Metric = ({ label, value }: { label: string; value: number }) => (
  <div className="metric">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const LocationTree = ({ state }: { state: LoadState<LocationNode[]> }) => {
  if (state.status === 'loading') {
    return (
      <div className="callout muted">
        <LoaderCircle className="spin" size={20} />
        Loading locations
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="callout danger">
        <CircleAlert size={20} />
        {state.message}
      </div>
    );
  }

  if (state.data.length === 0) {
    return (
      <div className="empty-state">
        <Search size={28} />
        <h3>No locations found</h3>
        <p>Run `npm run seed:locations` from `apps/server`, then refresh this admin page.</p>
      </div>
    );
  }

  return (
    <div className="tree-list">
      {state.data.map((location) => (
        <LocationBranch key={location.id} location={location} depth={0} />
      ))}
    </div>
  );
};

const LocationBranch = ({
  location,
  depth,
}: {
  location: LocationNode;
  depth: number;
}) => (
  <div>
    <article className="location-row" style={{ paddingLeft: `${12 + depth * 22}px` }}>
      <div>
        <strong>{location.number}</strong>
        <span>{location.name}</span>
      </div>
      <div className="location-meta">
        <span>{location.building}</span>
        {location.department ? <span>{location.department}</span> : null}
        {location.capacity ? <span>{location.capacity} seats</span> : null}
        {location.isBookable ? <span className="bookable">Bookable</span> : null}
      </div>
      {location.openTime ? <p>{location.openTime}</p> : null}
    </article>
    {(location.children ?? []).map((child) => (
      <LocationBranch key={child.id} location={child} depth={depth + 1} />
    ))}
  </div>
);

const InlineResult = ({
  message,
  error,
}: {
  message: string | null;
  error: string | null;
}) => {
  if (!message && !error) {
    return null;
  }

  return (
    <div className={`callout ${error ? 'danger' : 'success'}`}>
      {error ? <CircleAlert size={18} /> : <CircleCheck size={18} />}
      {error ?? message}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
