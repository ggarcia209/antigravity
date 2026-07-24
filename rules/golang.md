---
trigger: always_on
---

# Golang (Go) Development Rules

Rules for development with the Go Programming Language.

## General Rules

- All application logic should be defined with interfaces so that it is modular and mockable for unit testing.
- Data models should be defined as structs that support json marshalling.
- Each packages containing application logic must have unit tests.
- Logical components of an application should be grouped by purpose and function in distinct packages.
  - ex: logic for shipping orders and logic for managing sales data should exist in 2 separate packages ("shipping", "sales")
- Never use `goto` statements. This is bad practice that leads to unreadable code that is difficult to reason about and maintain.

## Development for Distributed Environment

- Assume that all applications will be deployed in a distributed cloud environment.
- Assume all application logic will run on multiple cloud instances concurrently.
- You must account for potential issues specific to distributed environemnts when planning and making development decisions.
- Some specific examples include race conditions, byzantine faults, and eventually consistent databases.

## Error Handling

- In most cases, error logging should only occur at the highest level (ex: handler)
- Wrap errors with the name of the caller (ex: `return fmt.Errorf("cli,get: %w", err)`)

## Testing

- Use inductive proof to validate correctness of the system. Test the atomic units of the logical components first, then work your way up the sytem, testing each higher-level component. Each dependency of a logical component must be tested.
- Always use table-driven tests when possible. Both positive and error cases should be consolidated into a single table-driven test function where possible.
- Generate mocks with mockgen and use go.uber.org/gomock package.
- Use custom validators for gomock if necessary.
- Do not manually write mocks unless absolutely necessary.
- Unit test files should use `assert.Implements` to test the package logic's interface implementation.

## Examples

Use the following pseudo-code fragments as examples when writing Go code

### Wrap errors returned by a function with the name of the caller

```go
if err := cli.SomeFunc(); err != nil {
    return fmt.Errorf("cli.SomeFunc: %w", err)
}
```

### Use if statement for error and boolean return variables

```go
if err := someFunc(); err != nil {
    // handle error...
}

if _, err := someOtherFunc(): err != nil {
    // handler error...
}

if n, ok := someMap[i[; !ok {
    // handle false case
}
```

### Table-driven test with mocks

This example only validates a returned error value.
Functions that return data should be tested for data accuracy.

```go
func TestPut(t *testing.T) {
	tests := []struct {
		name      string
		mockSetup func(m *mocks.MockDynamoDBClient)
		expectErr error
	}{
		{
			name: "success",
			mockSetup: func(m *mocks.MockDynamoDBClient) {
				m.EXPECT().PutItem(gomock.Any(), gomock.Any()).Return(&dynamodb.PutItemOutput{}, nil)
			},
			expectErr: nil,
		},
		{
			name: "dynamodb error",
			mockSetup: func(m *mocks.MockDynamoDBClient) {
				m.EXPECT().PutItem(gomock.Any(), gomock.Any()).Return(nil, errors.New("dynamodb error"))
			},
			expectErr: errors.New("d.Client.PutItem: dynamodb error"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			mockClient := mocks.NewMockDynamoDBClient(ctrl)
			tt.mockSetup(mockClient)

			dao := NewDynamoDBDAO(mockClient, "test-table")
			item := TestItem{ID: "123", Name: "Test"}
			err := dao.Put(context.Background(), item)

			if tt.expectErr != nil {
				assert.Error(t, err)
				assert.EqualError(t, err, tt.expectErr.Error())
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

```

### Defining Error Types and Vars

Define errors that can be re-used as vars or structs implementing `error` interface

```go
var (
    ErrItemNotFound = errors.New("item not found")
)


type SessionExpiredError struct {
    unixTime int64
}

func (e *Error) Error() string {
    return fmt.Sprintf("session expired at %d", unixTime)
}

func NewSessionExpiredError(unixTime int64) *SessionExpiredError {
    return &SessionExpiredError(unixTime: unixTime)
}

```
