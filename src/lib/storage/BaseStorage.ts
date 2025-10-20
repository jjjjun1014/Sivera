// Base Storage 클래스 - localStorage와 AWS 마이그레이션을 위한 추상화

export abstract class BaseStorage<T> {
  protected storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  // TODO: AWS API Gateway + Lambda + DynamoDB로 교체
  // 현재는 localStorage 사용, 나중에 API 호출로 변경
  protected getFromLocalStorage(): T | null {
    if (typeof window === "undefined") return null;

    try {
      const item = localStorage.getItem(this.storageKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (${this.storageKey}):`, error);
      return null;
    }
  }

  // TODO: AWS API로 교체
  protected saveToLocalStorage(data: T): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage (${this.storageKey}):`, error);
    }
  }

  // TODO: AWS API로 교체
  protected removeFromLocalStorage(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error(`Error removing from localStorage (${this.storageKey}):`, error);
    }
  }

  // 하위 클래스에서 구현해야 할 추상 메서드
  abstract load(): T | null;
  abstract save(data: T): void;
  abstract clear(): void;
}

// AWS 마이그레이션을 위한 인터페이스 (미래 구현용)
export interface StorageAdapter<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
}

// TODO: AWS DynamoDB 어댑터 구현
// export class DynamoDBAdapter<T> implements StorageAdapter<T> {
//   async get(key: string): Promise<T | null> {
//     const response = await dynamoDBClient.getItem({
//       TableName: 'AppStorage',
//       Key: { id: { S: key } }
//     });
//     return response.Item ? JSON.parse(response.Item.data.S) : null;
//   }
//
//   async set(key: string, value: T): Promise<void> {
//     await dynamoDBClient.putItem({
//       TableName: 'AppStorage',
//       Item: {
//         id: { S: key },
//         data: { S: JSON.stringify(value) },
//         updatedAt: { N: Date.now().toString() }
//       }
//     });
//   }
//
//   async delete(key: string): Promise<void> {
//     await dynamoDBClient.deleteItem({
//       TableName: 'AppStorage',
//       Key: { id: { S: key } }
//     });
//   }
// }
