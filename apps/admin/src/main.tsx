import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Building2,
  CalendarCheck,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { buildBookingPayload } from './bookingPayload';
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

type LocationDraft = {
  building: string;
  name: string;
  number: string;
  department: string;
  capacity: string;
  openTime: string;
  isBookable: boolean;
  parentId: string;
};

type BookingDraft = {
  startAt: string;
  endAt: string;
};

type BookingResponse = {
  id: string;
  locationId: string;
  department: string;
  attendeeCount: number;
  startAt: string;
  endAt: string;
  status: string;
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

const emptyLocationDraft: LocationDraft = {
  building: '',
  name: '',
  number: '',
  department: '',
  capacity: '',
  openTime: '',
  isBookable: false,
  parentId: '',
};

const apiLocationToDraft = (location: LocationNode): LocationDraft => ({
  building: location.building,
  name: location.name,
  number: location.number,
  department: location.department ?? '',
  capacity: location.capacity?.toString() ?? '',
  openTime: location.openTime ?? '',
  isBookable: location.isBookable,
  parentId: location.parentId ?? '',
});

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

const rangesOverlap = (
  leftStart: Date,
  leftEnd: Date,
  rightStart: Date,
  rightEnd: Date,
) => leftStart < rightEnd && leftEnd > rightStart;

const collectDescendantIds = (location: LocationNode | undefined): Set<string> => {
  const ids = new Set<string>();

  const visit = (node: LocationNode) => {
    for (const child of node.children ?? []) {
      ids.add(child.id);
      visit(child);
    }
  };

  if (location) {
    visit(location);
  }

  return ids;
};

const App = () => {
  const [locations, setLocations] = React.useState<LoadState<LocationNode[]>>({
    status: 'loading',
  });
  const [bookings, setBookings] = React.useState<LoadState<BookingResponse[]>>({
    status: 'loading',
  });
  const [selectedUpdateLocationId, setSelectedUpdateLocationId] = React.useState('');
  const [selectedLocationId, setSelectedLocationId] = React.useState('');
  const [bookingDraft, setBookingDraft] = React.useState<BookingDraft>({
    startAt: '',
    endAt: '',
  });
  const [locationDraft, setLocationDraft] =
    React.useState<LocationDraft>(emptyLocationDraft);
  const [isLocationEditing, setIsLocationEditing] = React.useState(true);
  const [locationDraftDirty, setLocationDraftDirty] = React.useState(false);
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

  const loadBookings = React.useCallback(async () => {
    setBookings({ status: 'loading' });
    try {
      const existingBookings = await requestJson<BookingResponse[]>('/bookings');
      setBookings({ status: 'ready', data: existingBookings });
    } catch (error) {
      setBookings({
        status: 'error',
        message: error instanceof Error ? error.message : 'Could not load bookings',
      });
    }
  }, []);

  React.useEffect(() => {
    void loadLocations();
  }, [loadLocations]);

  React.useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const flatLocations =
    locations.status === 'ready' ? flattenLocations(locations.data) : [];
  const bookableLocations = flatLocations.filter((location) => location.isBookable);
  const bookingStartAt = bookingDraft.startAt ? new Date(bookingDraft.startAt) : null;
  const bookingEndAt = bookingDraft.endAt ? new Date(bookingDraft.endAt) : null;
  const hasBookingTimeRange =
    bookingStartAt !== null &&
    bookingEndAt !== null &&
    !Number.isNaN(bookingStartAt.getTime()) &&
    !Number.isNaN(bookingEndAt.getTime()) &&
    bookingEndAt > bookingStartAt;
  const unavailableLocationIds =
    bookings.status === 'ready' && hasBookingTimeRange
      ? new Set(
          bookings.data
            .filter(
              (booking) =>
                booking.status === 'confirmed' &&
                rangesOverlap(
                  bookingStartAt,
                  bookingEndAt,
                  new Date(booking.startAt),
                  new Date(booking.endAt),
                ),
            )
            .map((booking) => booking.locationId),
        )
      : new Set<string>();
  const selectedBookingRoomUnavailable = unavailableLocationIds.has(selectedLocationId);
  const selectedUpdateLocation = flatLocations.find(
    (location) => location.id === selectedUpdateLocationId,
  );
  const selectedParentLocation = flatLocations.find(
    (location) => location.id === locationDraft.parentId,
  );
  const isUpdateMode = Boolean(selectedUpdateLocationId);
  const canEditLocation = !isUpdateMode || isLocationEditing;
  const blockedParentIds = collectDescendantIds(selectedUpdateLocation);
  if (selectedUpdateLocationId) {
    blockedParentIds.add(selectedUpdateLocationId);
  }

  React.useEffect(() => {
    if (!selectedUpdateLocationId) {
      setLocationDraft(emptyLocationDraft);
      setIsLocationEditing(true);
      setLocationDraftDirty(false);
      return;
    }

    if (selectedUpdateLocation) {
      setLocationDraft(apiLocationToDraft(selectedUpdateLocation));
      setIsLocationEditing(false);
      setLocationDraftDirty(false);
    }
  }, [selectedUpdateLocationId, selectedUpdateLocation]);

  const resetLocationMessages = () => {
    setLocationError(null);
    setLocationResult(null);
  };

  const changeDraft = <K extends keyof LocationDraft>(key: K, value: LocationDraft[K]) => {
    setLocationDraft((current) => ({ ...current, [key]: value }));
    setLocationDraftDirty(true);
    resetLocationMessages();
  };

  const tryChangeLocationTarget = (nextId: string) => {
    if (
      locationDraftDirty &&
      !window.confirm('Discard unsaved location form changes and switch mode?')
    ) {
      return;
    }

    setSelectedUpdateLocationId(nextId);
    resetLocationMessages();
  };

  const startCreateLocation = () => {
    tryChangeLocationTarget('');
  };

  const editLocation = (locationId: string) => {
    tryChangeLocationTarget(locationId);
  };

  const cancelLocationEdit = () => {
    if (selectedUpdateLocation) {
      setLocationDraft(apiLocationToDraft(selectedUpdateLocation));
    }
    setIsLocationEditing(false);
    setLocationDraftDirty(false);
    resetLocationMessages();
  };

  const submitLocation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocationError(null);
    setLocationResult(null);

    if (!canEditLocation) {
      setLocationError('Unlock this location before saving changes.');
      return;
    }

    const building = locationDraft.building.trim();
    const name = locationDraft.name.trim();
    const number = locationDraft.number.trim();
    const capacityValue = locationDraft.capacity.trim();

    if (!building || !name || !number) {
      setLocationError('Fill out building, number, and name before saving.');
      return;
    }

    const payload = {
      building,
      name,
      number,
      department: locationDraft.department.trim() || null,
      capacity: capacityValue ? Number(capacityValue) : null,
      openTime: locationDraft.openTime.trim() || null,
      isBookable: locationDraft.isBookable,
      parentId: locationDraft.parentId || null,
    };

    if (Number.isNaN(payload.capacity)) {
      setLocationError('Capacity must be a number.');
      return;
    }

    try {
      const saved = await requestJson<LocationNode>(
        isUpdateMode ? `/locations/${selectedUpdateLocationId}` : '/locations',
        {
          method: isUpdateMode ? 'PATCH' : 'POST',
          body: JSON.stringify(
            isUpdateMode
              ? payload
              : {
                  ...payload,
                  department: payload.department ?? undefined,
                  capacity: payload.capacity ?? undefined,
                  openTime: payload.openTime ?? undefined,
                  parentId: payload.parentId ?? undefined,
                },
          ),
        },
      );
      setLocationResult(`${isUpdateMode ? 'Updated' : 'Created'} ${saved.number}`);
      setLocationDraftDirty(false);
      setSelectedUpdateLocationId(isUpdateMode ? saved.id : '');
      if (!isUpdateMode) {
        setLocationDraft(emptyLocationDraft);
      }
      setIsLocationEditing(!isUpdateMode);
      await loadLocations();
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : 'Could not save location');
    }
  };

  const deleteLocation = async (location: LocationNode) => {
    resetLocationMessages();
    const childCount = location.children?.length ?? 0;
    const childWarning =
      childCount > 0
        ? `\n\nThis location has ${childCount} child location(s). Backend policy only allows deleting leaf locations.`
        : '';

    if (
      !window.confirm(
        `Delete ${location.number} - ${location.name}? This cannot be undone.${childWarning}`,
      )
    ) {
      return;
    }

    try {
      await requestJson<void>(`/locations/${location.id}`, { method: 'DELETE' });
      setLocationResult(`Deleted ${location.number}`);
      if (selectedUpdateLocationId === location.id) {
        setSelectedUpdateLocationId('');
        setLocationDraft(emptyLocationDraft);
        setIsLocationEditing(true);
        setLocationDraftDirty(false);
      }
      await loadLocations();
    } catch (error) {
      setLocationError(
        error instanceof Error
          ? `Delete failed for ${location.number}: ${error.message}`
          : `Delete failed for ${location.number}`,
      );
    }
  };

  const submitBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookingError(null);
    setBookingResult(null);

    if (selectedBookingRoomUnavailable) {
      setBookingError('Room is already booked during the selected time.');
      return;
    }

    const data = new FormData(event.currentTarget);
    const payload = buildBookingPayload(data);

    try {
      const created = await requestJson<BookingResponse>('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setBookingResult(created);
      await loadBookings();
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
        <button
          className="icon-button"
          type="button"
          onClick={() => {
            void loadLocations();
            void loadBookings();
          }}
        >
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
          <LocationTree
            state={locations}
            selectedLocationId={selectedUpdateLocationId}
            onDelete={deleteLocation}
            onEdit={editLocation}
          />
        </div>

        <div className="side-stack">
          <form
            className={`form-panel ${isUpdateMode ? 'update-mode' : 'create-mode'}`}
            noValidate
            onSubmit={submitLocation}
          >
            <div className="panel-heading split-heading">
              <div>
                <div className="heading-row">
                  {isUpdateMode ? <Lock size={20} /> : <Plus size={20} />}
                  <h2>{isUpdateMode ? 'Update location' : 'Create location'}</h2>
                </div>
                <p>
                  {isUpdateMode
                    ? canEditLocation
                      ? 'Editing unlocked. Save only when changes are intentional.'
                      : 'Existing values are locked until edit is enabled.'
                    : 'Add a new node under an optional parent.'}
                </p>
              </div>
              {isUpdateMode ? (
                <div className="heading-actions">
                  <button className="icon-button compact" type="button" onClick={startCreateLocation}>
                    <Plus size={16} />
                    <span>New</span>
                  </button>
                  {canEditLocation ? (
                    <button className="icon-button compact" type="button" onClick={cancelLocationEdit}>
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  ) : (
                    <button
                      className="icon-button compact"
                      type="button"
                      onClick={() => {
                        setIsLocationEditing(true);
                        resetLocationMessages();
                      }}
                    >
                      <Pencil size={16} />
                      <span>Edit</span>
                    </button>
                  )}
                  {selectedUpdateLocation ? (
                    <button
                      className="danger-button compact"
                      type="button"
                      onClick={() => void deleteLocation(selectedUpdateLocation)}
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="form-grid">
              <label className="wide">
                Mode / update target
                <select
                  name="updateId"
                  value={selectedUpdateLocationId}
                  onChange={(event) => tryChangeLocationTarget(event.target.value)}
                >
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
                <input
                  name="building"
                  required
                  placeholder="A"
                  value={locationDraft.building}
                  disabled={!canEditLocation}
                  onChange={(event) => changeDraft('building', event.target.value)}
                />
              </label>
              <label>
                Number
                <input
                  name="number"
                  required
                  placeholder="A-01-04"
                  value={locationDraft.number}
                  disabled={!canEditLocation}
                  onChange={(event) => changeDraft('number', event.target.value)}
                />
              </label>
              <label className="wide">
                Name
                <input
                  name="name"
                  required
                  placeholder="Focus Room"
                  value={locationDraft.name}
                  disabled={!canEditLocation}
                  onChange={(event) => changeDraft('name', event.target.value)}
                />
              </label>
              <label>
                Department
                <input
                  name="department"
                  placeholder="EFM"
                  value={locationDraft.department}
                  disabled={!canEditLocation}
                  onChange={(event) => changeDraft('department', event.target.value)}
                />
              </label>
              <label>
                Capacity
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  placeholder="8"
                  value={locationDraft.capacity}
                  disabled={!canEditLocation}
                  onChange={(event) => changeDraft('capacity', event.target.value)}
                />
              </label>
              <label className="wide">
                Open time
                <input
                  name="openTime"
                  placeholder="Mon to Fri (9AM to 6PM)"
                  value={locationDraft.openTime}
                  disabled={!canEditLocation}
                  onChange={(event) => changeDraft('openTime', event.target.value)}
                />
              </label>
              <label className="wide">
                Parent
                <select
                  name="parentId"
                  value={locationDraft.parentId}
                  disabled={!canEditLocation}
                  onChange={(event) => changeDraft('parentId', event.target.value)}
                >
                  <option value="">None - root location</option>
                  {flatLocations
                    .filter((location) => !blockedParentIds.has(location.id))
                    .map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.number} - {location.name}
                      </option>
                    ))}
                </select>
              </label>
              <p className="field-note wide">
                {selectedParentLocation
                  ? `Current parent: ${selectedParentLocation.number} - ${selectedParentLocation.name}.`
                  : 'Current parent: none, this location is at the root.'}{' '}
                Changing parent moves this node in the hierarchy.
              </p>
              <label className="toggle wide">
                <input
                  name="isBookable"
                  type="checkbox"
                  checked={locationDraft.isBookable}
                  disabled={!canEditLocation}
                  onChange={(event) => changeDraft('isBookable', event.target.checked)}
                />
                Bookable room
              </label>
            </div>
            <div className="button-row">
              {!isUpdateMode ? (
                <button className="secondary-button" type="button" onClick={startCreateLocation}>
                  <Plus size={18} />
                  <span>New</span>
                </button>
              ) : null}
              <button className="primary-button" type="submit" disabled={!canEditLocation}>
                <Save size={18} />
                <span>{isUpdateMode ? 'Save changes' : 'Create location'}</span>
              </button>
            </div>
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
                      {unavailableLocationIds.has(location.id) ? ' (Unavailable)' : ''}
                    </option>
                  ))}
                </select>
              </label>
              <div className="availability-row wide">
                {bookings.status === 'error' ? (
                  <span className="availability-badge warning">Availability unavailable</span>
                ) : selectedBookingRoomUnavailable ? (
                  <span className="availability-badge unavailable">Unavailable</span>
                ) : hasBookingTimeRange && selectedLocationId ? (
                  <span className="availability-badge available">Available</span>
                ) : (
                  <span className="availability-badge neutral">Choose time to check availability</span>
                )}
              </div>
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
                <input
                  name="startAt"
                  required
                  type="datetime-local"
                  value={bookingDraft.startAt}
                  onChange={(event) =>
                    setBookingDraft((current) => ({
                      ...current,
                      startAt: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Ends
                <input
                  name="endAt"
                  required
                  type="datetime-local"
                  value={bookingDraft.endAt}
                  onChange={(event) =>
                    setBookingDraft((current) => ({
                      ...current,
                      endAt: event.target.value,
                    }))
                  }
                />
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

const LocationTree = ({
  state,
  selectedLocationId,
  onDelete,
  onEdit,
}: {
  state: LoadState<LocationNode[]>;
  selectedLocationId: string;
  onDelete: (location: LocationNode) => void;
  onEdit: (locationId: string) => void;
}) => {
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
        <LocationBranch
          key={location.id}
          location={location}
          depth={0}
          selectedLocationId={selectedLocationId}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

const LocationBranch = ({
  location,
  depth,
  selectedLocationId,
  onDelete,
  onEdit,
}: {
  location: LocationNode;
  depth: number;
  selectedLocationId: string;
  onDelete: (location: LocationNode) => void;
  onEdit: (locationId: string) => void;
}) => (
  <div>
    <article
      className={`location-row ${selectedLocationId === location.id ? 'selected' : ''}`}
      style={{ paddingLeft: `${12 + depth * 22}px` }}
    >
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
      <div className="location-detail">
        {location.openTime ? <p>{location.openTime}</p> : <p>No open time set</p>}
        <p>{location.parentId ? 'Child location' : 'Root location'}</p>
      </div>
      <div className="row-actions">
        <button className="icon-button compact" type="button" onClick={() => onEdit(location.id)}>
          <Pencil size={16} />
          <span>Edit</span>
        </button>
        <button className="danger-button compact" type="button" onClick={() => onDelete(location)}>
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>
    </article>
    {(location.children ?? []).map((child) => (
      <LocationBranch
        key={child.id}
        location={child}
        depth={depth + 1}
        selectedLocationId={selectedLocationId}
        onDelete={onDelete}
        onEdit={onEdit}
      />
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
