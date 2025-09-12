import { o as config } from './ssr.mjs';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    __publicField(this, "status");
    this.status = status;
  }
}
async function request(path, opts = {}) {
  const url = `${config.apiBaseUrl}${path}`;
  const headers = { ...opts.headers || {} };
  const hasBody = typeof opts.body !== "undefined" && !(opts.body instanceof FormData);
  if (hasBody) headers["Content-Type"] = "application/json";
  if (opts.token) headers["Authorization"] = `Bearer ${opts.token}`;
  const res = await fetch(url, { ...opts, headers });
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = isJson && (body == null ? void 0 : body.message) ? body.message : res.statusText;
    throw new ApiError(msg || "Request failed", res.status);
  }
  return body;
}
async function requestGateway(path, opts = {}) {
  const res = await request(path, opts);
  if (!res.success) {
    const msg = res.error || res.message || "Request failed";
    throw new ApiError(msg);
  }
  return res;
}
const api = {
  // Auth
  register: (payload) => requestGateway("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  }),
  login: (payload) => requestGateway("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  }),
  profile: (token) => request("/auth/profile", { token }),
  // Courses
  listCourses: (params = {}) => {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.page_size) search.set("page_size", String(params.page_size));
    if (params.q) search.set("q", params.q);
    const qs = search.toString();
    return requestGateway(`/courses${qs ? `?${qs}` : ""}`);
  },
  getCourse: (id) => requestGateway(`/courses/${id}`),
  listLectures: (courseId, params = {}) => {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.page_size) search.set("page_size", String(params.page_size));
    const qs = search.toString();
    return requestGateway(`/courses/${courseId}/lectures${qs ? `?${qs}` : ""}`);
  },
  enroll: (token, courseId) => requestGateway(`/courses/${courseId}/enroll`, {
    method: "POST",
    token
  }),
  // Enrollments
  listEnrollments: (token, params = {}) => {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.page_size) search.set("page_size", String(params.page_size));
    const qs = search.toString();
    return requestGateway(`/enrollments${qs ? `?${qs}` : ""}`, { token });
  },
  // Course management (instructor)
  createCourse: (token, payload) => requestGateway("/courses", {
    method: "POST",
    body: JSON.stringify(payload),
    token
  }),
  updateCourse: (token, id, payload) => requestGateway(`/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    token
  }),
  deleteCourse: (token, id) => requestGateway(`/courses/${id}`, { method: "DELETE", token }),
  createLecture: (token, payload) => requestGateway("/courses/lectures", {
    method: "POST",
    body: JSON.stringify(payload),
    token
  }),
  // Video (proxied)
  getVideo: (videoId) => request(`/videos/${videoId}`),
  listCourseVideos: (courseId) => request(`/videos/course/${courseId}`),
  // Progress
  updateProgress: (token, payload) => request("/progress/update", {
    method: "POST",
    body: JSON.stringify(payload),
    token
  }),
  getLectureProgress: (token, courseId, lectureId) => request(
    `/progress/courses/${courseId}/lectures/${lectureId}`,
    { token }
  ),
  getCourseProgress: (token, courseId) => request(`/progress/courses/${courseId}`, { token }),
  getCourseCompletion: (token, courseId) => request(`/progress/courses/${courseId}/completion`, {
    token
  }),
  completeLecture: (token, payload) => request("/progress/lectures/complete", {
    method: "POST",
    body: JSON.stringify(payload),
    token
  }),
  // Analytics
  getUserAnalytics: (token) => request("/analytics/user", { token }),
  // Files (Bucket)
  uploadFile: (token, form) => fetch(`${config.apiBaseUrl}/files/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form
  }).then(async (r) => {
    if (!r.ok) throw new ApiError(r.statusText, r.status);
    return r.json();
  }),
  listFiles: (token, params = {}) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (typeof v === "number" || typeof v === "string" && v !== "") {
        search.set(k, String(v));
      }
    });
    const qs = search.toString();
    return request(`/files${qs ? `?${qs}` : ""}`, { token });
  },
  deleteFile: (token, fileId) => request(`/files/${fileId}`, { method: "DELETE", token }),
  getFileMetadata: (token, fileId) => request(`/files/${fileId}/metadata`, { token }),
  startMultipart: (token, payload) => request("/files/upload/start", {
    method: "POST",
    body: JSON.stringify(payload),
    token
  }),
  getMultipartUrls: (token, uploadId, payload) => request(`/files/upload/${uploadId}/parts`, {
    method: "POST",
    body: JSON.stringify(payload),
    token
  }),
  completeMultipart: (token, uploadId, payload) => request(`/files/upload/${uploadId}/complete`, {
    method: "POST",
    body: JSON.stringify(payload),
    token
  }),
  // Forum
  listTopics: (params = {}) => {
    const s = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== void 0) s.set(k, String(v));
    });
    const qs = s.toString();
    return request(`/forum/topics${qs ? `?${qs}` : ""}`);
  },
  getTopic: (topicId) => request(`/forum/topics/${topicId}`),
  listTopicPosts: (topicId, params = {}) => {
    const s = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== void 0) s.set(k, String(v));
    });
    const qs = s.toString();
    return request(`/forum/topics/${topicId}/posts${qs ? `?${qs}` : ""}`);
  },
  createTopic: (token, payload) => request("/forum/topics", {
    method: "POST",
    body: JSON.stringify(payload),
    token
  }),
  createPost: (token, payload) => request("/forum/posts", {
    method: "POST",
    body: JSON.stringify(payload),
    token
  }),
  // Payments
  createPaymentMethod: (token, payload) => request("/payments/methods", {
    method: "POST",
    body: JSON.stringify(payload),
    token
  }),
  listPaymentMethods: (token) => request("/payments/methods", { token }),
  setDefaultPaymentMethod: (token, methodId) => request(`/payments/methods/${methodId}/default`, { method: "PUT", token }),
  deletePaymentMethod: (token, methodId) => request(`/payments/methods/${methodId}`, { method: "DELETE", token }),
  purchaseCourse: (token, courseId, payload) => request(`/payments/purchase/course/${courseId}`, {
    method: "POST",
    body: JSON.stringify(payload),
    token
  }),
  listTransactions: (token, params = {}) => {
    const s = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => s.set(k, String(v)));
    const qs = s.toString();
    return request(`/payments/transactions${qs ? `?${qs}` : ""}`, { token });
  },
  listSubscriptions: (token) => request("/payments/subscriptions", { token }),
  createSubscription: (token, payload) => request("/payments/subscriptions", {
    method: "POST",
    body: JSON.stringify(payload),
    token
  }),
  updateSubscription: (token, subscriptionId, payload) => request(`/payments/subscriptions/${subscriptionId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    token
  }),
  // Chatbot (REST)
  listChatSessions: (token, params = {}) => {
    const s = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => s.set(k, String(v)));
    const qs = s.toString();
    return request(`/chat/sessions${qs ? `?${qs}` : ""}`, { token });
  },
  createChatSession: (token, payload) => request("/chat/sessions", { method: "POST", body: JSON.stringify(payload), token }),
  sendChatMessage: (token, sessionId, payload) => request(`/chat/sessions/${sessionId}/messages`, {
    method: "POST",
    body: JSON.stringify(payload),
    token
  })
};

export { api as a };
//# sourceMappingURL=api-client-Dtm8Zh8Q.mjs.map
