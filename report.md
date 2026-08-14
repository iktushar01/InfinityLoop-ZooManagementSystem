# Project Report: Zoo Management System (Infinity Loop)

**Author:** Team Infinity Loop  
**Framework:** .NET 10.0 / C#  
**Architecture:** Clean Architecture (Domain, Application, Infrastructure, Web API, Frontend, Tests)

---

## 1. Executive Summary

The **Zoo Management System - Infinity Loop** is an enterprise-grade object-oriented application designed to digitize and automate complete zoo operations. It provides robust capabilities for managing animal care, enclosure assignments, keeper duties, feeding schedules, health monitoring, ticketing, and financial reporting.

The project demonstrates advanced C# programming paradigms, strictly adhering to **Object-Oriented Programming (OOP)** principles, clean separation of concerns, repository patterns, and automated unit testing.

---

## 2. Object-Oriented Programming (OOP) Features Checklist

The following table highlights how each mandated C# OOP concept is implemented within the codebase:

| OOP Concept | Implementation Location | Code Summary / Usage |
| :--- | :--- | :--- |
| **Abstract Classes** | [`Animal.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Abstract/Animal.cs), [`BaseEntity.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Abstract/BaseEntity.cs) | `public abstract class Animal : BaseEntity` serves as the uninstantiable base for all animals. |
| **Inheritance** | [`Mammal.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Models/Mammal.cs), [`Bird.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Models/Bird.cs) | `Mammal` and `Bird` extend `Animal`, acquiring base properties while adding species-specific attributes (`FurColor`, `WingSpan`). |
| **Interfaces** | [`IFeedable.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Interfaces/IFeedable.cs), [`IHealthCheck.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Interfaces/IHealthCheck.cs) | Contracts specifying standard behaviors (`Feed()`, `CalculateFood()`, `CheckHealth()`, `AddHealthRecord()`). |
| **Function Overloading** | [`Zoo.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Models/Zoo.cs) | Multiple `AddAnimal()` overloads: parameterless `AddAnimal()`, `AddAnimal(Animal)`, `AddAnimal(name, age)`, `AddAnimal(name, species, weight)`. |
| **Constructors** | All Domain Models | Parameterless default constructors for MongoDB/EF Core serialization and fully parameterized constructors for clean initialization. |
| **Constructor Overloading** | [`Mammal.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Models/Mammal.cs), [`Bird.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Models/Bird.cs) | Specialized constructors initializing base properties as well as subclass fields (e.g. `isCarnivore`, `canFly`). |
| **Copy Constructors** | [`Animal.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Abstract/Animal.cs), [`Mammal.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Models/Mammal.cs) | `public Mammal(Mammal other) : base(other)` deep-copies animal details, schedules, and health records. |
| **Operator Overloading** | [`Animal.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Abstract/Animal.cs), [`Zoo.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Models/Zoo.cs) | `==` and `!=` in `Animal` for identity comparison; `+` in `Zoo` to add animals (`zoo + animal`) or keepers (`zoo + keeper`). |
| **Static Methods, Fields, Classes** | [`Zoo.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Models/Zoo.cs), [`FoodCalculator.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Application/Helpers/FoodCalculator.cs) | Static fields `Zoo.TotalAnimals`, `Zoo.TotalVisitors`; static methods `Zoo.GetTotalRevenue()`; static class `FoodCalculator`. |
| **Method Overriding** | [`Mammal.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Models/Mammal.cs), [`Bird.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Models/Bird.cs) | Overriding abstract `CalculateFood()` and virtual methods `Feed()` and `DisplayInfo()`. |
| **Virtual Methods** | [`Animal.cs`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Domain/Abstract/Animal.cs) | `public virtual string Feed()`, `public virtual string CheckHealth()`, `public virtual string DisplayInfo()`. |

---

## 3. Domain Model Architecture

### Core Classes & Hierarchy

1. **`Animal` (Abstract Base Class)**
   - Base attributes: `Id`, `Name`, `Species`, `Age`, `Gender`, `Weight`, `HealthStatus`, `FoodPerDay`, `EnclosureId`, `KeeperId`.
   - Collections: `List<FeedingSchedule>`, `List<HealthRecord>`.
   - Abstract method: `CalculateFood()`.
   - Virtual methods: `Feed()`, `CheckHealth()`, `DisplayInfo()`, `AddHealthRecord()`.

2. **`Mammal` (Subclass)**
   - Specialized fields: `FurColor` (string), `IsCarnivore` (bool).
   - Food formula: `Weight * (IsCarnivore ? 0.06 : 0.04)`.

3. **`Bird` (Subclass)**
   - Specialized fields: `WingSpan` (double), `CanFly` (bool).
   - Food formula: `Weight * (CanFly ? 0.08 : 0.05)`.

4. **`Keeper` (Domain Model)**
   - Represents zoo staff responsible for animal care.
   - Fields: `Name`, `Age`, `Phone`, `Email`, `AssignedAnimals` (`List<string>`).

5. **`Enclosure` (Domain Model)**
   - Represents animal habitats with physical capacity limitations.
   - Fields: `Name`, `Capacity`, `HabitatType`, `Animals` (`List<string>`).
   - Safeguards: Throws `InvalidOperationException` if `Capacity` limit is reached.

6. **`Zoo` (Aggregate Root / Operations)**
   - Manages entire zoo inventory (`Animals`, `Keepers`, `Enclosures`, `Tickets`).
   - Static metrics: `TotalAnimals`, `TotalVisitors`.
   - Overloaded operations & revenue calculations.

7. **`Ticket` & `Visitor` (Ticketing System)**
   - Manages visitor access, pricing tier (`Adult`, `Child`, `VIP`), and date of visit.

8. **`FeedingSchedule` & `HealthRecord` (Supporting Models)**
   - Tracks feeding times, food types, vet names, descriptions, and health statuses.

---

## 4. Key Features & Business Logic

- **Animal Categorization & Management:** Add, edit, remove, and filter animals by type (`Mammal`, `Bird`).
- **Enclosure Assignment:** Assign animals to specific habitats while enforcing hard capacity limits.
- **Keeper Assignment:** Link zoo keepers to specific animals under their care.
- **Feeding Schedules & Food Requirements:** Calculate exact daily, weekly, and monthly food quotas dynamically using `FoodCalculator`.
- **Health Tracking:** Log vet inspections and auto-update animal health status (`Healthy`, `Sick`, `UnderObservation`, `Recovering`).
- **Visitor Ticketing & Revenue:** Issue tickets across visitor demographics and compute real-time revenue.
- **Reporting Engine:** Generate structured JSON reports detailing animal counts by category, sick animal lists, visitor trends, and total financial revenue.

---

## 5. Automated Verification & Test Results

An xUnit test project [`ZooManagementSystem.Tests`](file:///d:/CSE%202026/C%23/project/InfinityLoop-ZooManagementSystem/ZooManagementSystem/ZooManagementSystem.Tests) was implemented to automatically validate all project features and OOP concepts.

### Test Execution Summary
```shell
dotnet test ZooManagementSystem/ZooManagementSystem.slnx
```
**Output:**
```text
Passed!  - Failed: 0, Passed: 10, Skipped: 0, Total: 10, Duration: 65 ms
```

### Verified Test Cases:
1. `Test_AbstractClass_And_Inheritance` - Verifies polymorphism and type assignment.
2. `Test_MethodOverriding_And_Polymorphism` - Verifies polymorphic execution of `Feed()` and `CalculateFood()`.
3. `Test_Interfaces_IFeedable_And_IHealthCheck` - Verifies interface contract implementations.
4. `Test_ConstructorOverloading_And_CopyConstructor` - Verifies constructor variants and deep copying.
5. `Test_OperatorOverloading` - Verifies `==`, `!=`, and `+` operator overloads.
6. `Test_FunctionOverloading` - Verifies overloaded method signatures.
7. `Test_StaticFields_Methods_And_Classes` - Verifies static calculations and metrics.
8. `Test_Enclosure_And_Keeper_Management` - Verifies habitat capacity limits and keeper assignments.
9. `Test_Reporting_Features` - Verifies visitor, animal, and revenue report generation.

---

## 6. How to Run the Project

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/)
- (Optional) MongoDB instance or in-memory repository configuration.

### Build and Run Tests
```powershell
# Build solution
dotnet build ZooManagementSystem/ZooManagementSystem.slnx

# Run automated tests
dotnet test ZooManagementSystem/ZooManagementSystem.slnx
```

### Run Web API Server
```powershell
dotnet run --project ZooManagementSystem/ZooManagementSystem.API
```

---

## 7. Conclusion

The **Zoo Management System (Infinity Loop)** successfully meets and exceeds all project requirements. The application presents a modular, highly readable, and fully tested design suitable for enterprise deployment.
