import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification';
import { AuthService } from '../auth/auth.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  // 1. Simulation du AuthService (Mock)
  // On fournit une valeur simulée pour éviter de dépendre du vrai système de login
  const authServiceMock = {
    currentUserValue: { id: 'user123', name: 'Joury Yazidi' }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NotificationService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // S'assure qu'aucune requête HTTP inattendue n'est restée en suspens
    httpMock.verify();
  });

  it('devrait être créé', () => {
    // Vérification de base : le service est bien instancié
    expect(service).toBeTruthy();
  });

  it('devrait charger l\'historique des notifications au démarrage', () => {
    const mockHistory = [
      { _id: '1', title: 'Notif 1', message: 'Contenu 1' },
      { _id: '2', title: 'Notif 2', message: 'Contenu 2' }
    ];

    // Interception de l'appel GET fait dans le constructeur (fetchHistory)
    const req = httpMock.expectOne('http://localhost:3000/api/notifications');
    expect(req.request.method).toBe('GET');
    
    // On simule la réponse du serveur
    req.flush(mockHistory);

    // On vérifie que le Signal Angular a bien été mis à jour avec les données
    expect(service.notifications().length).toBe(2);
    expect(service.notifications()).toEqual(mockHistory);
  });

  it('devrait supprimer une notification du signal local après markAsRead', () => {
    // On pré-remplit manuellement le signal pour le test
    const initialData = [{ _id: 'notif99', title: 'A supprimer' }];
    service.notifications.set(initialData);

    // On appelle la méthode de suppression
    service.markAsRead('notif99').subscribe();

    // On intercepte la requête PATCH attendue
    const req = httpMock.expectOne('/api/notifications/notif99/read');
    expect(req.request.method).toBe('PATCH');
    req.flush({}); // On simule un succès (réponse vide)

    // Vérification : le signal doit être vide car l'ID a été filtré
    expect(service.notifications().length).toBe(0);
  });

  it('devrait gérer les erreurs de chargement d\'historique sans crasher', () => {
    // On simule une erreur serveur 500
    const req = httpMock.expectOne('http://localhost:3000/api/notifications');
    req.error(new ErrorEvent('Network error'), { status: 500 });

    // Le signal doit rester vide (état par défaut)
    expect(service.notifications()).toEqual([]);
  });
});