# Meal Sharing Platform – Microservices Architecture

Microservice applications for sharing and discovering meals. Users can offer meals, join others, rate experiences, and receive personalized recommendations — all built with Domain-Driven Design, event-driven communication, and scalability in mind.

> This project was developed as part of a school assignment for a **Solution Architecture** course.

---

## 🔧 Project Architecture

This project implements a distributed system using the **microservices pattern**. Each subdomain is a separate service that communicates asynchronously via **event messaging** (RabbitMQ).

![Screenshot showing historical_ai](images/class_diagram.jpg)

### 🧩 Microservices

| Service              | Description                                           |
|----------------------|-------------------------------------------------------|
| Meal Service         | Core domain: Manage meals (offer, update, filter)     |
| User Service         | Manage user data and preferences                      |
| Cook Service         | Manage cooks and ratings                              |
| Auth Service         | User registration, login, and authentication          |
| Email Service        | Sends email notifications on meal events              |
| Recommendation Service | Suggest meals and cooks based on preferences        |
| Monitoring Service   | Admin logbook for actions across all services         |
| Delivery Service (optional) | Handles optional meal deliveries               |

---

## ✅ Functional Requirements (Top Features)

| ID | Feature                                                                 | Priority |
|----|-------------------------------------------------------------------------|----------|
| 1  | Users can offer meals to share                                          | High     |
| 2  | Email notifications about meals and participants                        | High     |
| 3  | Filter meals based on user-defined criteria                             | Medium   |
| 4  | Personalized meal and cook recommendations                              | Medium   |
| 5  | Users can rate meals and cooks                                          | Medium   |
| 6  | View top-rated cooks                                                    | Medium   |
| 7  | View top-rated meals                                                    | Medium   |
| 8  | Join meals as a participant                                             | Medium   |
| 9  | Optional delivery support                                               | Low      |
| 10 | Admin monitoring via logbook system                                     | Low      |

---

## 🛠️ Non-Functional Requirements

- ✅ Scalable deployment of individual microservices
- ✅ Eventual consistency support (e.g., meals not instantly visible if a service is down)
- ✅ Location-based event messaging
- ✅ Follows **SOLID** design principles for extensibility
- ✅ Event-driven architecture ensures services are loosely coupled

---

## 🧠 Domain-Driven Design Overview

### 🏷️ Domain: Meal Sharing

#### Subdomains
- **Core Domain:** Meal Data Management
- Supporting Domains:
  - User Data Management
  - Cook Data Management
  - Auth Data Management

#### 🧬 Entities

| Entity       | Description                              |
|--------------|------------------------------------------|
| `Meal`       | Represents a shared meal                 |
| `User`       | Represents a participant or cook         |
| `Account`    | Represents user login credentials        |
| `CookRating` | Rating given to a cook                   |
| `MealRating` | Rating given to a meal                   |

---

## 🔒 Authentication & Authorization

Handled by the **Auth Service** using token-based security. Role-based access control is supported.

---

## 📬 Communication & Events

All microservices communicate asynchronously using **event messaging**. For example:

- When a meal is offered → an event is published.
- The Email Service consumes the event to send a notification.
- The Recommendation Service updates its model.

---

## 📊 Monitoring

All actions (user joins meal, ratings submitted, etc.) are logged in a centralized **Monitoring Service** accessible to admins.

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- RabbitMQ for messaging
- MongoDB for persistence
